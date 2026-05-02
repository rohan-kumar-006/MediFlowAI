from datetime import date
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class LoginResponse(BaseModel):
    message: str
    user_id: int


class PatientDetailsResponse(BaseModel):
    name: str
    date_of_birth: date | str | None = None
    gender: Optional[str] = None
    contact_number: Optional[str] = None
    medical_record_number: Optional[str] = None
    blood_group: Optional[str] = None
    marital_status: Optional[str] = None
    id: int


class MedicalHistoryResponse(BaseModel):
    past_diagnoses: Optional[str] = None
    surgeries: Optional[str] = None
    hospital_admissions: Optional[str] = None
    immunization_records: Optional[str] = None
    family_medical_history: Optional[str] = None
    lifestyle_factors: Optional[str] = None


class NormalizeRequest(BaseModel):
    phrases: list[str] = Field(default_factory=list)


class NormalizeResult(BaseModel):
    original: str
    cleaned: str
    matched_term: str
    score: float


class NormalizeResponse(BaseModel):
    results: list[NormalizeResult]


class Doctor(BaseModel):
    doctor_id: int
    name: str
    specialization: str
    rating: float = 0
    fees: int = 0
    hospital: Optional[str] = None
    next_available_date: str = "Not available"
    start_time: str = "N/A"
    end_time: str = "N/A"
    slot_id: Optional[int] = None


class AgentRunRequest(BaseModel):
    phrases: list[str] = Field(default_factory=list)


class AgentRunResponse(BaseModel):
    phrases: list[str]
    normalized_symptoms: list[str]
    specialists: list[str]
    recommended_specialists: list[str]
    doctors: list[Doctor]


class AppointmentRequest(BaseModel):
    patient_id: int
    doctor_id: int
    slot_id: int
    reason: str = Field(min_length=1)


class AppointmentResponse(BaseModel):
    message: str
    appointment_id: int


class GeminiRequest(BaseModel):
    prompt: str = Field(min_length=1)
    history: list[str] | str | None = None


class GeminiResponse(BaseModel):
    text: str
    raw: dict[str, Any] | None = None
