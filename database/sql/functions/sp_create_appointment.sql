DROP PROCEDURE IF EXISTS sp_create_appointment;
DELIMITER //

CREATE PROCEDURE sp_create_appointment(
    IN p_patient_id INT,
    IN p_doctor_id INT,
    IN p_slot_id INT,
    IN p_reason TEXT
)
BEGIN
    INSERT INTO appointments (patient_id, doctor_id, slot_id, reason)
    VALUES (p_patient_id, p_doctor_id, p_slot_id, p_reason);

    SELECT LAST_INSERT_ID() AS appointment_id;
END //

DELIMITER ;
