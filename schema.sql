-- ============================================================
-- Scholaro ERP — Database Schema
-- Database : MySQL 8+
-- Description : Authentication module user table
-- ============================================================

CREATE DATABASE IF NOT EXISTS scholaro_erp;
USE scholaro_erp;

-- Users table — stores registered students, teachers and admins
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    phone_number    VARCHAR(20)     NOT NULL,
    password        VARCHAR(255)    NOT NULL,   -- BCrypt hashed
    role            ENUM('STUDENT', 'TEACHER', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
