from fastapi import APIRouter

from backend.config import get_settings


router = APIRouter(tags=["health"])


@router.get("/")
async def root() -> dict[str, str]:
    return {"message": "Welcome to the Healthcare Agent API!"}


@router.get("/health")
async def health() -> dict[str, str | bool]:
    settings = get_settings()
    return {
        "status": "ok",
        "app": settings.app_name,
        "database_configured": settings.database_configured,
    }
