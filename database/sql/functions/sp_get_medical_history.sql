DROP PROCEDURE IF EXISTS sp_get_medical_history;
DELIMITER //

CREATE PROCEDURE sp_get_medical_history(
    IN p_patient_id INT
)
BEGIN
    SELECT
        ph.past_diagnoses,
        ph.surgeries,
        ph.hospital_admissions,
        ph.immunization_records,
        ph.family_medical_history,
        ph.lifestyle_factors
    FROM patient_history ph
    WHERE ph.patient_id = p_patient_id
    LIMIT 1;
END //

DELIMITER ;
