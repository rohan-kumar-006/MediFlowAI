DROP PROCEDURE IF EXISTS sp_get_patient_id;
DELIMITER //

CREATE PROCEDURE sp_get_patient_id(
    IN p_user_id INT
)
BEGIN
    SELECT p.id
    FROM patients p
    WHERE p.user_id = p_user_id
    LIMIT 1;
END //

DELIMITER ;