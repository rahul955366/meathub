-- MEATHUB Gym Service Database Setup
-- Database: meathub_gym

-- Create database
CREATE DATABASE IF NOT EXISTS meathub_gym;
USE meathub_gym;

-- Gym Subscriptions Table
CREATE TABLE IF NOT EXISTS gym_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    butcher_id BIGINT NOT NULL,
    meat_item_id BIGINT NOT NULL,
    meat_item_name VARCHAR(100),
    daily_quantity_kg VARCHAR(20) NOT NULL COMMENT 'SMALL, MEDIUM, LARGE enum',
    delivery_time TIME DEFAULT '06:00:00',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    next_delivery_date DATE NOT NULL,
    delivery_address VARCHAR(255),
    delivery_phone VARCHAR(15),
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    paused_at TIMESTAMP NULL,
    last_executed_at TIMESTAMP NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_active_next_run (active, next_delivery_date)
);
