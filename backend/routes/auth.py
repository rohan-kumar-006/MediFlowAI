import logging

from fastapi import APIRouter, HTTPException, status

from backend.models import LoginRequest, LoginResponse, SignupRequest, SignupResponse
from backend.services.database import DatabaseError, call_stored_procedure, db_session


logger = logging.getLogger(__name__)
router = APIRouter(tags=["auth"])


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


@router.post("/signup", response_model=SignupResponse)
def signup(request: SignupRequest) -> SignupResponse:
    try:
        with db_session() as conn:
            cursor = conn.cursor()
            
            # Start transaction
            cursor.execute("START TRANSACTION")
            
            try:
                # Insert user
                cursor.execute(
                    "INSERT INTO users (email, password) VALUES (%s, %s)",
                    (request.email, request.password)
                )
                user_id = cursor.lastrowid
                
                # Insert patient
                cursor.execute(
                    """INSERT INTO patients (user_id, name, date_of_birth, gender, contact_number, 
                       medical_record_number, blood_group, marital_status) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                    (user_id, request.name, request.date_of_birth, request.gender, 
                     request.contact_number, request.medical_record_number, 
                     request.blood_group, request.marital_status)
                )
                patient_id = cursor.lastrowid
                
                # Insert patient history record
                cursor.execute(
                    "INSERT INTO patient_history (patient_id) VALUES (%s)",
                    (patient_id,)
                )
                
                conn.commit()
                return SignupResponse(
                    message="Signup successful",
                    user_id=user_id,
                    patient_id=patient_id
                )
            except Exception as e:
                conn.rollback()
                error_msg = str(e)
                if "1062" in error_msg:  # Duplicate key error
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Email, contact number, or medical record already exists"
                    )
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Signup failed")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc
