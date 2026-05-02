import logging
from typing import TypedDict

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import END, StateGraph

from backend.config import Settings, get_settings
from backend.services.database import DatabaseError
from backend.tools import (
    fetch_doctor_details,
    lookup_specialists,
    normalize_symptoms,
    recommend_specialists,
)


logger = logging.getLogger(__name__)


class AgentState(TypedDict, total=False):
    phrases: list[str]
    normalized_symptoms: list[str]
    specialists: list[str]
    recommended_specialists: list[str]
    doctors: list[dict]


def _get_llm(settings: Settings) -> ChatOpenAI | None:
    if not settings.openai_api_key:
        return None
    return ChatOpenAI(
        model=settings.openai_model,
        temperature=0.2,
        api_key=settings.openai_api_key,
    )


def _csv(text: str) -> list[str]:
    return [item.strip() for item in text.split(",") if item.strip()]


def build_graph(settings: Settings | None = None):
    settings = settings or get_settings()
    llm = _get_llm(settings)

    def normalize_node(state: AgentState) -> AgentState:
        phrases = state.get("phrases", [])
        if llm:
            try:
                response = llm.invoke(
                    [
                        SystemMessage(content="You normalize patient symptom phrases into clinical symptom terms."),
                        HumanMessage(
                            content=(
                                "Return only comma-separated clinical terms for these symptoms:\n"
                                f"{phrases}"
                            )
                        ),
                    ]
                )
                normalized = _csv(str(response.content).lower())
                if normalized:
                    return {"normalized_symptoms": normalized}
            except Exception:
                logger.exception("LLM normalization failed; falling back to tool")
        return {"normalized_symptoms": normalize_symptoms.invoke({"phrases": phrases})}

    def specialist_node(state: AgentState) -> AgentState:
        try:
            return {"specialists": lookup_specialists.invoke({"symptoms": state.get("normalized_symptoms", [])})}
        except DatabaseError as exc:
            logger.warning("Specialist lookup skipped: %s", exc)
            return {"specialists": []}

    def recommendation_node(state: AgentState) -> AgentState:
        symptoms = state.get("normalized_symptoms", [])
        specialists = state.get("specialists", [])
        if not symptoms or not specialists:
            return {"recommended_specialists": []}

        if llm:
            try:
                response = llm.bind_tools([recommend_specialists]).invoke(
                    [
                        SystemMessage(
                            content=(
                                "Pick the best 1 or 2 specialists from the available list. "
                                "Call recommend_specialists with your selected names."
                            )
                        ),
                        HumanMessage(
                            content=(
                                f"Symptoms: {', '.join(symptoms)}\n"
                                f"Available specialists: {', '.join(specialists)}"
                            )
                        ),
                    ]
                )
                tool_calls = getattr(response, "tool_calls", None) or []
                if tool_calls:
                    selected = recommend_specialists.invoke(
                        {
                            "symptoms": symptoms,
                            "specialists": tool_calls[0].get("args", {}).get("specialists") or specialists,
                        }
                    )
                    selected = [name for name in selected if name in specialists]
                    if selected:
                        return {"recommended_specialists": selected[:2]}
            except Exception:
                logger.exception("LLM recommendation failed; falling back to tool")

        return {
            "recommended_specialists": recommend_specialists.invoke(
                {"symptoms": symptoms, "specialists": specialists}
            )
        }

    def doctors_node(state: AgentState) -> AgentState:
        try:
            return {"doctors": fetch_doctor_details.invoke({"specialists": state.get("recommended_specialists", [])})}
        except DatabaseError as exc:
            logger.warning("Doctor lookup skipped: %s", exc)
            return {"doctors": []}

    builder = StateGraph(AgentState)
    builder.add_node("normalize", normalize_node)
    builder.add_node("lookup_specialists", specialist_node)
    builder.add_node("recommend_specialists", recommendation_node)
    builder.add_node("fetch_doctors", doctors_node)
    builder.set_entry_point("normalize")
    builder.add_edge("normalize", "lookup_specialists")
    builder.add_edge("lookup_specialists", "recommend_specialists")
    builder.add_edge("recommend_specialists", "fetch_doctors")
    builder.add_edge("fetch_doctors", END)
    return builder.compile()


def run_medical_agent(phrases: list[str], settings: Settings | None = None) -> AgentState:
    state = build_graph(settings).invoke({"phrases": phrases})
    return {
        "phrases": state.get("phrases", phrases),
        "normalized_symptoms": state.get("normalized_symptoms", []),
        "specialists": state.get("specialists", []),
        "recommended_specialists": state.get("recommended_specialists", []),
        "doctors": state.get("doctors", []),
    }
