from .ai import router as ai_router
from .appointments import router as appointments_router
from .auth import router as auth_router
from .health import router as health_router
from .patients import router as patients_router

__all__ = [
    "ai_router",
    "appointments_router",
    "auth_router",
    "health_router",
    "patients_router",
]
