-- MEATHUB Auth Service - Database Setup Scripts
-- Run these scripts if you need to manually set up the database

-- Create Database (if not auto-created)
CREATE DATABASE IF NOT EXISTS meathub_auth;
USE meathub_auth;

-- Note: Tables will be auto-created by Hibernate
-- But you can use these scripts for reference or manual setup

-- Create Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Create User-Roles Join Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Pre-populate Roles (Optional - roles are created automatically on first registration)
INSERT INTO roles (name) VALUES ('USER') ON DUPLICATE KEY UPDATE name='USER';
INSERT INTO roles (name) VALUES ('BUTCHER') ON DUPLICATE KEY UPDATE name='BUTCHER';
INSERT INTO roles (name) VALUES ('ADMIN') ON DUPLICATE KEY UPDATE name='ADMIN';

-- Verify Setup
SELECT * FROM roles;
