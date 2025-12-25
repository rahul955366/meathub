-- MEATHUB Order Service Database Setup
-- Database: meathub_order

-- Create database (optional - Spring Boot will create it automatically)
CREATE DATABASE IF NOT EXISTS meathub_order;
USE meathub_order;

-- Carts Table
CREATE TABLE IF NOT EXISTS carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    meat_item_id BIGINT NOT NULL,
    butcher_id BIGINT NOT NULL,
    meat_item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'KG',
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    INDEX idx_cart_id (cart_id),
    INDEX idx_meat_item_id (meat_item_id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    butcher_id BIGINT NOT NULL,
    butcher_business_name VARCHAR(100),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    delivery_address VARCHAR(255),
    delivery_phone VARCHAR(15),
    notes VARCHAR(500),
    cancellation_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_butcher_id (butcher_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    meat_item_id BIGINT NOT NULL,
    meat_item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'KG',
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_meat_item_id (meat_item_id)
);
