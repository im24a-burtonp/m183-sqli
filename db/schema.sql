-- =====================================================================
--  M183 SQL-Injection – Datenschicht
--  Legt die Tabellen sowie eine Stored Procedure für den sicheren
--  Login an (Gegenmassnahme 3.3).
-- =====================================================================

CREATE DATABASE IF NOT EXISTS m183_sqli
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE m183_sqli;

-- ---------------------------------------------------------------------
--  Benutzer (Login + Rollen). Ziel der Angriffe auf
--  Vertraulichkeit (Login-Bypass) und Integrität (Rollen-Manipulation).
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50)  NOT NULL UNIQUE,
  -- Hinweis: Passwörter werden hier bewusst im Klartext gehalten, damit
  -- der UNION-basierte Auslese-Angriff sichtbar wird. In einer echten
  -- Applikation gehört hier ein Hash (z. B. bcrypt/argon2) hin.
  password VARCHAR(100) NOT NULL,
  role     ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  email    VARCHAR(120) NOT NULL
);

-- ---------------------------------------------------------------------
--  Vertrauliche Datensätze. Dürfen NUR von Admins gelesen werden.
--  Ziel des Angriffs auf die Vertraulichkeit (2.1).
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS secrets;
CREATE TABLE secrets (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  owner   VARCHAR(50)  NOT NULL,
  label   VARCHAR(120) NOT NULL,
  content VARCHAR(255) NOT NULL
);

-- ---------------------------------------------------------------------
--  Gegenmassnahme 3.3: Stored Procedure für den Login.
--  Die SQL-Struktur ist fest in der DB gespeichert; Eingaben können
--  nur noch als Parameter (Daten) übergeben werden, nie als SQL-Code.
-- ---------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_login;
DELIMITER //
CREATE PROCEDURE sp_login (IN p_username VARCHAR(50), IN p_password VARCHAR(100))
BEGIN
  SELECT id, username, role, email
  FROM users
  WHERE username = p_username
    AND password = p_password;
END //
DELIMITER ;
