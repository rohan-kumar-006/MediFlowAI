import logging
from collections.abc import Iterable
from contextlib import contextmanager
from typing import Any
from pathlib import Path

import mysql.connector
from mysql.connector import MySQLConnection

from backend.config import Settings, get_settings


logger = logging.getLogger(__name__)


class DatabaseError(RuntimeError):
    pass


def _parse_sql_with_delimiters(content: str) -> list[str]:
    """Parse SQL content handling DELIMITER statements."""
    statements = []
    current_statement = ""
    current_delimiter = ";"
    
    for line in content.split("\n"):
        line = line.rstrip()
        
        # Check for DELIMITER command
        if line.strip().upper().startswith("DELIMITER"):
            # If we have a current statement, save it first
            if current_statement.strip():
                statements.append(current_statement.strip())
                current_statement = ""
            
            # Extract the new delimiter
            parts = line.split()
            if len(parts) > 1:
                current_delimiter = parts[1]
            continue
        
        # Skip empty lines and comments
        if not line.strip() or line.strip().startswith("--"):
            if current_statement:
                current_statement += "\n"
            continue
        
        # Add line to current statement
        if current_statement:
            current_statement += "\n" + line
        else:
            current_statement = line
        
        # Check if statement ends with current delimiter
        if line.rstrip().endswith(current_delimiter):
            # Remove the delimiter from the end
            stmt = current_statement.rstrip()
            if stmt.endswith(current_delimiter):
                stmt = stmt[:-len(current_delimiter)].rstrip()
            
            if stmt:
                statements.append(stmt)
            
            current_statement = ""
    
    # Add any remaining statement
    if current_statement.strip():
        statements.append(current_statement.strip())
    
    return statements


def run_all_sql_files(settings: Settings):
    """Execute all SQL files from database/sql directory using Python mysql.connector."""
    try:
        base_path = Path(__file__).resolve().parents[2] / "database/sql"
        schema_file = base_path / "schema.sql"
        functions_path = base_path / "functions"

        conn = get_db_connection(settings)
        cursor = conn.cursor()

        try:
            logger.info("Running schema.sql...")
            schema_content = schema_file.read_text(encoding="utf-8")
            statements = _parse_sql_with_delimiters(schema_content)
            
            for statement in statements:
                try:
                    cursor.execute(statement)
                    logger.debug(f"Executed schema statement")
                except mysql.connector.Error as e:
                    # Ignore "already exists" warnings for schema
                    if "already exists" not in str(e).lower():
                        logger.warning(f"Schema execution: {e}")

            conn.commit()

            logger.info("Running stored procedures...")
            for file in sorted(functions_path.glob("*.sql")):
                logger.info(f"Running {file.name}")
                procedure_content = file.read_text(encoding="utf-8")
                statements = _parse_sql_with_delimiters(procedure_content)
                
                for statement in statements:
                    try:
                        logger.debug(f"Executing: {statement[:100]}...")
                        cursor.execute(statement)
                        logger.info(f"Created procedure from {file.name}")
                    except mysql.connector.Error as e:
                        logger.error(f"Failed to create procedure from {file.name}: {e}")
                        raise

            conn.commit()
            logger.info("All SQL files executed successfully.")

        finally:
            cursor.close()
            conn.close()

    except mysql.connector.Error as e:
        logger.exception("SQL execution failed")
        raise DatabaseError(f"Failed to execute SQL files: {e}") from e


def get_db_connection(settings: Settings | None = None) -> MySQLConnection:
    settings = settings or get_settings()

    if not settings.database_configured:
        raise DatabaseError("Database is not configured. Set DB_* values in backend/.env.")

    try:
        return mysql.connector.connect(
            host=settings.db_host,
            port=settings.db_port,
            user=settings.db_user,
            password=settings.db_password,
            database=settings.db_name,
        )

    except mysql.connector.Error as exc:
        logger.exception("Could not connect to MySQL")
        raise DatabaseError("Database connection failed") from exc


@contextmanager
def db_session(settings: Settings | None = None):
    conn = get_db_connection(settings)
    try:
        yield conn
    finally:
        conn.close()


def call_stored_procedure(
    conn: MySQLConnection,
    procedure_name: str,
    params: Iterable[Any] | None = None,
) -> list[tuple[Any, ...]]:
    args = list(params or [])
    cursor = conn.cursor()

    try:
        logger.info("Calling stored procedure %s", procedure_name)
        cursor.callproc(procedure_name, args)

        rows: list[tuple[Any, ...]] = []
        for result in cursor.stored_results():
            rows.extend(result.fetchall())

        return rows

    except mysql.connector.Error as exc:
        logger.exception("Stored procedure failed: %s", procedure_name)
        raise DatabaseError(f"Stored procedure failed: {procedure_name}") from exc

    finally:
        cursor.close()