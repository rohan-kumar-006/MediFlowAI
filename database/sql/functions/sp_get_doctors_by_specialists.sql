DROP PROCEDURE IF EXISTS sp_get_doctors_by_specialists;
DELIMITER //

CREATE PROCEDURE sp_get_doctors_by_specialists(
    IN p_specialists TEXT
)
BEGIN
    SELECT
        d.id AS doctor_id,
        d.name,
        d.specialization,
        d.rating,
        d.fees,
        h.name AS hospital,
        a.available_date AS next_available_date,
        a.start_time,
        a.end_time,
        a.id AS slot_id
    FROM doctors d
    LEFT JOIN hospitals h ON d.hospital_id = h.id
    LEFT JOIN availability_slots a ON d.id = a.doctor_id
    WHERE FIND_IN_SET(d.specialization, p_specialists) > 0
    ORDER BY a.available_date, a.start_time;
END //

DELIMITER ;
