import logging

from fastapi import APIRouter, HTTPException, status

from backend.models import LoginRequest, LoginResponse
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
