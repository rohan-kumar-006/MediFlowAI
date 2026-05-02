import logging

import mysql.connector
from fastapi import APIRouter, HTTPException, status

from backend.models import LoginRequest, LoginResponse, SignupRequest, SignupResponse
from backend.services.database import DatabaseError, call_stored_procedure, db_session


logger = logging.getLogger(__name__)
router = APIRouter(tags=["auth"])


@router.post("/signup", response_model=SignupResponse)
def signup(request: SignupRequest) -> SignupResponse:
    try:
        with db_session() as conn:
            cursor = conn.cursor()

            try:
                cursor.execute(
                    "INSERT INTO users (email, password) VALUES (%s, %s)",
                    (request.email, request.password),
                )
                user_id = int(cursor.lastrowid)

                cursor.execute(
                    """
                    INSERT INTO patients (
                        user_id,
                        name,
                        date_of_birth,
                        gender,
                        contact_number,
                        medical_record_number,
                        blood_group,
                        marital_status
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        user_id,
                        request.name,
                        request.date_of_birth,
                        request.gender,
                        request.contact_number,
                        request.medical_record_number,
                        request.blood_group,
                        request.marital_status,
                    ),
                )
                patient_id = int(cursor.lastrowid)

                cursor.execute(
                    """
                    INSERT INTO patient_history (
                        patient_id,
                        past_diagnoses,
                        surgeries,
                        hospital_admissions,
                        immunization_records,
                        family_medical_history,
                        lifestyle_factors
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        patient_id,
                        "None",
                        "None",
                        "None",
                        "None",
                        "None",
                        "None",
                    ),
                )

                conn.commit()

            except mysql.connector.Error as exc:
                conn.rollback()
                if getattr(exc, "errno", None) == 1062:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="A patient with the same email, contact number, or medical record number already exists.",
                    ) from exc
                raise

            finally:
                cursor.close()

    except HTTPException:
        raise
    except DatabaseError as exc:
        logger.exception("Signup failed")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc
    except mysql.connector.Error as exc:
        logger.exception("Signup failed")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Signup failed") from exc

    return SignupResponse(message="Signup successful", user_id=user_id, patient_id=patient_id)


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest) -> LoginResponse:
    try:
        with db_session() as conn:
            rows = call_stored_procedure(conn, "sp_login_user", [request.email, request.password])
    except DatabaseError as exc:
        logger.exception("Login failed")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc

    user = rows[0] if rows else None
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return LoginResponse(message="Login successful", user_id=int(user[0]))
