from functools import lru_cache
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env", override=True)


class Settings(BaseSettings):
    app_name: str = "MediFlow Healthcare Agent API"
    log_level: str = "INFO"
    frontend_origin: str = "http://localhost:5173"

    db_host: str = "localhost"
    db_port: int = 3306
    db_user: Optional[str] = None
    db_password: Optional[str] = None
    db_name: Optional[str] = None

    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4o-mini"

    groq_api_key: Optional[str] = None
    groq_model: str = "llama-3.1-8b-instant"

    enable_embeddings: bool = False
    embedding_model_name: str = "all-MiniLM-L6-v2"

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        if self.frontend_origin == "*":
            return ["*"]
        return [origin.strip() for origin in self.frontend_origin.split(",") if origin.strip()]

    @property
    def database_configured(self) -> bool:
        return bool(self.db_host and self.db_user and self.db_password and self.db_name)

    @property
    def groq_configured(self) -> bool:
        return bool(self.groq_api_key and self.groq_model)


@lru_cache
def get_settings() -> Settings:
    return Settings()
