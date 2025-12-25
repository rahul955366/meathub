-- MEATHUB Admin Service Database Setup
-- Database: meathub_admin
-- Note: Admin service primarily aggregates data, but may store logs/reports here.

-- Create database
CREATE DATABASE IF NOT EXISTS meathub_admin;
USE meathub_admin;

-- Admin Reports Table (Future Use)
CREATE TABLE IF NOT EXISTS admin_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_type VARCHAR(50) NOT NULL COMMENT 'DAILY_SALES, USER_GROWTH',
    report_data JSON,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table (Future Use)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_service VARCHAR(50),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
