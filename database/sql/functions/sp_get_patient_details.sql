DROP PROCEDURE IF EXISTS sp_get_patient_details;
DELIMITER //

CREATE PROCEDURE sp_get_patient_details(
    IN p_user_id INT
)
BEGIN
    SELECT
        p.name,
        p.date_of_birth,
        p.gender,
        p.contact_number,
        p.medical_record_number,
        p.blood_group,
        p.marital_status,
        p.id
    FROM patients p
    WHERE p.user_id = p_user_id
    LIMIT 1;
END //

DELIMITER ;
