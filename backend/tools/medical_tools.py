from langchain_core.tools import tool
from pydantic import BaseModel, Field

from backend.services.database import call_stored_procedure, db_session
from backend.utils import preprocess_text


CANONICAL_SYMPTOMS: dict[str, tuple[str, ...]] = {
    "Chest Pain": ("chest pain", "pain in chest", "chest discomfort", "tightness in chest"),
    "Skin Allergy": ("skin allergy", "skin rash", "rash", "itching", "itchy skin", "hives"),
    "Fever": ("fever", "high temperature", "temperature", "chills", "hot body", "body temperature"),
}


class PhrasesInput(BaseModel):
    phrases: list[str] = Field(description="Raw patient symptom phrases")


class SymptomsInput(BaseModel):
    symptoms: list[str] = Field(description="Normalized symptom terms")


class RecommendationInput(BaseModel):
    symptoms: list[str] = Field(description="Normalized symptom terms")
    specialists: list[str] = Field(description="Available specialist names")


class SpecialistsInput(BaseModel):
    specialists: list[str] = Field(description="Recommended specialist names")


@tool(args_schema=PhrasesInput)
def normalize_symptoms(phrases: list[str]) -> list[str]:
    """Normalize patient symptom phrases into simple clinical terms."""
    normalized: list[str] = []
    for phrase in phrases:
        cleaned = preprocess_text(phrase)
        if not cleaned:
            continue

        matched_terms: list[str] = []
        for canonical, aliases in CANONICAL_SYMPTOMS.items():
          if any(alias in cleaned for alias in aliases):
              matched_terms.append(canonical)

        if matched_terms:
            normalized.extend(matched_terms)
            continue

        for part in cleaned.split(","):
            part = part.strip()
            if part:
                normalized.append(part.title())
    return list(dict.fromkeys(normalized))


@tool(args_schema=SymptomsInput)
def lookup_specialists(symptoms: list[str]) -> list[str]:
    """Look up matching medical specialists from the database."""
    if not symptoms:
        return []
    with db_session() as conn:
        rows = call_stored_procedure(conn, "sp_get_specialists", [",".join(symptoms)])
    return [str(row[0]) for row in rows if row and row[0]]


@tool(args_schema=RecommendationInput)
def recommend_specialists(symptoms: list[str], specialists: list[str]) -> list[str]:
    """Select the most suitable first specialists from the available list."""
    if not symptoms or not specialists:
        return []
    return specialists[:2]


@tool(args_schema=SpecialistsInput)
def fetch_doctor_details(specialists: list[str]) -> list[dict]:
    """Fetch doctors and appointment slots for specialist names."""
    if not specialists:
        return []
    with db_session() as conn:
        rows = call_stored_procedure(conn, "sp_get_doctors_by_specialists", [",".join(specialists)])

    doctors: list[dict] = []
    for row in rows:
        doctors.append(
            {
                "doctor_id": int(row[0]),
                "name": str(row[1]),
                "specialization": str(row[2]),
                "rating": float(row[3] or 0),
                "fees": int(row[4] or 0),
                "hospital": str(row[5]) if row[5] is not None else None,
                "next_available_date": str(row[6]) if row[6] else "Not available",
                "start_time": str(row[7]) if row[7] else "N/A",
                "end_time": str(row[8]) if row[8] else "N/A",
                "slot_id": int(row[9]) if row[9] is not None else None,
            }
        )
    return doctors
