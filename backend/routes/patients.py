import logging

from fastapi import APIRouter, HTTPException, status

from backend.models import MedicalHistoryResponse, PatientDetailsResponse
from backend.services.database import DatabaseError, call_stored_procedure, db_session


logger = logging.getLogger(__name__)
router = APIRouter(tags=["patients"])


@router.get("/patient-details/{user_id}", response_model=PatientDetailsResponse)
def get_patient_details(user_id: int) -> PatientDetailsResponse:
    try:
        # print(user_id)
        with db_session() as conn:
            rows = call_stored_procedure(conn, "sp_get_patient_details", [user_id])
    except DatabaseError as exc:
        logger.exception("Patient details lookup failed")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc

    row = rows[0] if rows else None
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    
    return PatientDetailsResponse(
        name=row[0],
        date_of_birth=row[1],
        gender=row[2],
        contact_number=row[3],
        medical_record_number=row[4],
        blood_group=row[5],
        marital_status=row[6],
        id=int(row[7]),
    )


@router.get("/medical-history/{user_id}", response_model=MedicalHistoryResponse)
def get_medical_history(user_id: int) -> MedicalHistoryResponse:
    try:
        with db_session() as conn:
            patient_rows = call_stored_procedure(conn, "sp_get_patient_id", [user_id])
            # print(patient_rows)
            patient_row = patient_rows[0] if patient_rows else None
            if not patient_row:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
            history_rows = call_stored_procedure(conn, "sp_get_medical_history", [patient_row[0]])
    except HTTPException:
        raise
    except DatabaseError as exc:
        logger.exception("Medical history lookup failed")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc

    row = history_rows[0] if history_rows else None
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medical history not found")

    return MedicalHistoryResponse(
        past_diagnoses=row[0],
        surgeries=row[1],
        hospital_admissions=row[2],
        immunization_records=row[3],
        family_medical_history=row[4],
        lifestyle_factors=row[5],
    )
