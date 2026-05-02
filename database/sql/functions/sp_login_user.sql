DROP PROCEDURE IF EXISTS sp_login_user;
DELIMITER //

CREATE PROCEDURE sp_login_user(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    SELECT u.id, u.email, u.password
    FROM users u
    WHERE u.email = p_email AND u.password = p_password
    LIMIT 1;
END //

DELIMITER ;