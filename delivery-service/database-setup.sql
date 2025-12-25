-- MEATHUB Delivery Service Database Setup
-- Database: meathub_delivery

-- Create database (optional - Spring Boot will create it automatically)
CREATE DATABASE IF NOT EXISTS meathub_delivery;
USE meathub_delivery;

-- Delivery Agents Table
CREATE TABLE IF NOT EXISTS delivery_agents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_active (active)
);

-- Deliveries Table
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNIQUE NOT NULL,
    agent_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ASSIGNED',
    failure_reason VARCHAR(255),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    picked_up_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    failed_at TIMESTAMP NULL,
    FOREIGN KEY (agent_id) REFERENCES delivery_agents(id),
    INDEX idx_order_id (order_id),
    INDEX idx_agent_id (agent_id),
    INDEX idx_status (status)
);
