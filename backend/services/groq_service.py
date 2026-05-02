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


def _history_to_messages(history: list[str] | str | None, prompt: str) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = [{"role": "system", "content": SYSTEM_INSTRUCTION}]

    if isinstance(history, list):
        for item in history:
            if item.startswith("User:"):
                messages.append({"role": "user", "content": item.removeprefix("User:").strip()})
            elif item.startswith("Agent:"):
                messages.append({"role": "assistant", "content": item.removeprefix("Agent:").strip()})
            elif item.strip():
                messages.append({"role": "user", "content": item.strip()})
    elif isinstance(history, str) and history.strip():
        messages.append({"role": "user", "content": history.strip()})

    messages.append({"role": "user", "content": prompt.strip()})
    return messages


def _extract_text(response: Any) -> str:
    choices = getattr(response, "choices", None) or []
    for choice in choices:
        message = getattr(choice, "message", None)
        content = getattr(message, "content", None)
        if content:
            return str(content).strip()
    return ""


def run_groq(prompt: str, history: list[str] | str | None = None, settings: Settings | None = None) -> dict[str, Any]:
    settings = settings or get_settings()
    if not settings.groq_api_key:
        raise RuntimeError("GROQ_API_KEY is not configured")

    try:
        from groq import Groq

        client = Groq(api_key=settings.groq_api_key)
        messages = _history_to_messages(history, prompt)
        logger.info("Calling Groq with model %s", settings.groq_model)

        response = client.chat.completions.create(
            model=settings.groq_model,
            messages=messages,
            temperature=0.4,
        )

        response_text = _extract_text(response)
        if not response_text:
            logger.error("Groq returned empty response")
            return {
                "text": "I couldn't generate a response right now. Please try again.",
                "raw": {"error": "empty response"},
            }

        logger.info("Groq response: %s", response_text[:100])
        return {"text": response_text, "raw": None}
    except ImportError as exc:
        logger.error("groq package is not installed")
        raise RuntimeError("groq package is not installed") from exc
    except Exception as exc:
        logger.exception("Groq request failed: %s", exc)
        return {
            "text": "I couldn't generate a response right now. Please try again.",
            "raw": {"error": str(exc)},
        }