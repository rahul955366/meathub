-- MEATHUB Butcher Service Database Setup
-- Database: meathub_butcher

-- Create database (optional - Spring Boot will create it automatically)
CREATE DATABASE IF NOT EXISTS meathub_butcher;
USE meathub_butcher;

-- Butchers Table
CREATE TABLE IF NOT EXISTS butchers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    business_name VARCHAR(100) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    gst_number VARCHAR(50),
    fssai_license VARCHAR(50),
    description VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    rejection_reason VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_email (email)
);

-- Meat Items Table
CREATE TABLE IF NOT EXISTS meat_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    butcher_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    meat_type VARCHAR(20) NOT NULL,
    cut_type VARCHAR(20) NOT NULL,
    price_per_kg DECIMAL(10, 2) NOT NULL,
    stock_quantity_kg INT NOT NULL DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    unit VARCHAR(50) DEFAULT 'KG',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (butcher_id) REFERENCES butchers(id) ON DELETE CASCADE,
    INDEX idx_butcher_id (butcher_id),
    INDEX idx_meat_type (meat_type),
    INDEX idx_is_available (is_available)
);
