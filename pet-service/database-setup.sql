-- MEATHUB Pet Service Database Setup
-- Database: meathub_pet

-- Create database
CREATE DATABASE IF NOT EXISTS meathub_pet;
USE meathub_pet;

-- Pet Products Table
CREATE TABLE IF NOT EXISTS pet_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    butcher_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL COMMENT 'RAW, COOKED, BONES, ORGANS, MIX',
    price_per_kg DECIMAL(10,2) NOT NULL,
    available_stock_kg DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_butcher_id (butcher_id),
    INDEX idx_is_available (is_available)
);

-- Pet Subscriptions Table
CREATE TABLE IF NOT EXISTS pet_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    pet_type VARCHAR(20) NOT NULL COMMENT 'DOG, CAT',
    product_id BIGINT NOT NULL,
    product_name VARCHAR(100),
    quantity_kg DECIMAL(10,2) NOT NULL,
    schedule_type VARCHAR(20) NOT NULL COMMENT 'DAILY, WEEKLY, MONTHLY',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    next_delivery_date DATE NOT NULL,
    delivery_address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    paused_at TIMESTAMP NULL,
    last_executed_at TIMESTAMP NULL,
    FOREIGN KEY (product_id) REFERENCES pet_products(id),
    INDEX idx_user_id (user_id),
    INDEX idx_active_next_run (active, next_delivery_date)
);
