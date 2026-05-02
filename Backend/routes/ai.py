import logging

from fastapi import APIRouter, HTTPException, Request, status

from backend.agents import run_medical_agent
from backend.models import AgentRunRequest, AgentRunResponse, GeminiRequest, GeminiResponse, NormalizeRequest, NormalizeResponse
from backend.services.embedding_service import SymptomNormalizer
from backend.services.groq_service import run_groq


logger = logging.getLogger(__name__)
router = APIRouter(tags=["ai"])


@router.post("/normalize", response_model=NormalizeResponse)
async def normalize(payload: NormalizeRequest, request: Request) -> NormalizeResponse:
    normalizer: SymptomNormalizer | None = getattr(request.app.state, "symptom_normalizer", None)
    if normalizer is None or not normalizer.ready:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Embedding model is not initialized")
    return NormalizeResponse(results=normalizer.normalize(payload.phrases))


@router.post("/run_langgraph", response_model=AgentRunResponse)
async def run_langgraph(payload: AgentRunRequest) -> AgentRunResponse:
    if not payload.phrases:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No phrases provided")
    try:
        return AgentRunResponse(**run_medical_agent(payload.phrases))
    except Exception as exc:
        logger.exception("LangGraph execution failed")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Agent execution failed") from exc


@router.post("/api/run_groq", response_model=GeminiResponse)
@router.post("/api/run_gemini", response_model=GeminiResponse)
async def run_groq_proxy(payload: GeminiRequest) -> GeminiResponse:
    try:
        return GeminiResponse(**run_groq(payload.prompt, payload.history))
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Groq proxy failed")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="AI request failed") from exc
