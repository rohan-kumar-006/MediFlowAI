DROP PROCEDURE IF EXISTS sp_get_specialists;
DELIMITER //

CREATE PROCEDURE sp_get_specialists(
    IN p_symptoms TEXT
)
BEGIN
    SELECT DISTINCT s.name
    FROM specialists s
    JOIN specialist_symptom ss ON s.id = ss.specialist_id
    JOIN symptoms sy ON sy.id = ss.symptom_id
    WHERE FIND_IN_SET(sy.name, p_symptoms) > 0;
END //

DELIMITER ;
