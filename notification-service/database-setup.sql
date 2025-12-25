-- MEATHUB Notification Service Database Setup
-- Database: meathub_notification

-- Create database
CREATE DATABASE IF NOT EXISTS meathub_notification;
USE meathub_notification;

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL COMMENT 'USER, BUTCHER, AGENT, ADMIN',
    title VARCHAR(100) NOT NULL,
    message VARCHAR(500) NOT NULL,
    type VARCHAR(20) NOT NULL COMMENT 'ORDER, DELIVERY, SYSTEM...',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_unread (user_id, is_read)
);
