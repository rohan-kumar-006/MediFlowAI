import os
import sys
from contextlib import asynccontextmanager
from pathlib import Path

os.environ.setdefault("TRANSFORMERS_NO_TF", "1")
os.environ.setdefault("USE_TF", "0")
os.environ.setdefault("USE_TORCH", "1")

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.config import get_settings
from backend.config.logging import configure_logging
from backend.routes import ai_router, appointments_router, auth_router, health_router, patients_router
from backend.services.database import DatabaseError, run_all_sql_files
from backend.services.embedding_service import SymptomNormalizer


settings = get_settings()
configure_logging(settings.log_level)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database with schema and stored procedures
    try:
        run_all_sql_files(settings)
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Database initialization failed: {e}")
    
    app.state.symptom_normalizer = SymptomNormalizer(settings)
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(DatabaseError)
async def database_error_handler(_: Request, exc: DatabaseError) -> JSONResponse:
    return JSONResponse(status_code=500, content={"detail": str(exc)})


app.include_router(health_router)
app.include_router(auth_router)
app.include_router(patients_router)
app.include_router(appointments_router)
app.include_router(ai_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
