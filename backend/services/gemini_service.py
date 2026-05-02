import logging
from typing import Any

from backend.config import Settings, get_settings


logger = logging.getLogger(__name__)


SYSTEM_INSTRUCTION = (
    "You are a helpful AI Medical Assistant. Ask follow-up questions one at a time "
    "to gather the patient's symptoms. Wait for the patient's response before asking "
    "the next question. Do not ask multiple questions together. Do not decide or "
    "mention any medical specialist. Once enough symptoms are collected, say: "
    "'I have thoroughly examined your symptoms. Now you can click on disconnect.'"
)


def _history_text(history: list[str] | str | None) -> str:
    if isinstance(history, list):
        return "\n".join(history)
    return history or ""


def _extract_response_text(response: Any) -> str:
    text = getattr(response, "text", None)
    if text:
        return text.strip()

    candidates = getattr(response, "candidates", None) or []
    for candidate in candidates:
        content = getattr(candidate, "content", None)
        parts = getattr(content, "parts", None) or []
        for part in parts:
            part_text = getattr(part, "text", None)
            if part_text:
                return part_text.strip()

    return ""


def run_gemini(prompt: str, history: list[str] | str | None = None, settings: Settings | None = None) -> dict[str, Any]:
    settings = settings or get_settings()
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured")

    try:
        import google.generativeai as genai

        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel(
            model_name=settings.gemini_model,
            system_instruction=SYSTEM_INSTRUCTION,
        )
        
        history_text = _history_text(history)
        full_prompt = f"{history_text}\nUser: {prompt}".strip()
        logger.info(f"Calling Gemini with prompt: {full_prompt[:100]}...")
        
        response = model.generate_content(full_prompt)

        response_text = _extract_response_text(response)
        if not response_text:
            logger.error("Gemini returned empty response")
            return {
                "text": "I couldn't generate a response right now. Please try again.",
                "raw": {"error": "empty response"},
            }

        logger.info(f"Gemini response: {response_text[:100]}...")
        return {"text": response_text, "raw": None}
    except ImportError as exc:
        logger.error("google-generativeai is not installed")
        raise RuntimeError("google-generativeai is not installed") from exc
    except Exception as exc:
        logger.exception(f"Gemini request failed: {exc}")
        return {
            "text": "I couldn't generate a response right now. Please try again.",
            "raw": {"error": str(exc)},
        }
