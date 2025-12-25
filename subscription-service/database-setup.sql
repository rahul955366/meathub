-- MEATHUB Subscription Service Database Setup
-- Database: meathub_subscription

-- Create database (optional - Spring Boot will create it automatically)
CREATE DATABASE IF NOT EXISTS meathub_subscription;
USE meathub_subscription;

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    butcher_id BIGINT NOT NULL,
    meat_item_id BIGINT NOT NULL,
    meat_item_name VARCHAR(100),
    quantity_kg DECIMAL(10,2) NOT NULL,
    period VARCHAR(20) NOT NULL DEFAULT 'WEEKLY',
    delivery_option VARCHAR(30) NOT NULL,
    primary_day_of_week VARCHAR(20),
    secondary_day_of_week VARCHAR(20),
    delivery_time TIME,
    is_sunday_special BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    next_run_date DATE NOT NULL,
    delivery_address VARCHAR(255),
    delivery_phone VARCHAR(15),
    subscription_price DECIMAL(10,2) NOT NULL,
    notify_if_not_home BOOLEAN NOT NULL DEFAULT FALSE,
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    paused_at TIMESTAMP NULL,
    last_executed_at TIMESTAMP NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_butcher_id (butcher_id),
    INDEX idx_active_next_run (active, next_run_date),
    INDEX idx_primary_day_of_week (primary_day_of_week),
    INDEX idx_delivery_option (delivery_option)
);
