-- MEATHUB Media Service Database Setup
-- Database: meathub_media

-- Create database
CREATE DATABASE IF NOT EXISTS meathub_media;
USE meathub_media;

-- Media Items Table
CREATE TABLE IF NOT EXISTS media_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    related_type VARCHAR(20) NOT NULL COMMENT 'ORDER, MEAT_ITEM, COOKING',
    related_id BIGINT NOT NULL,
    uploaded_by VARCHAR(20) NOT NULL COMMENT 'BUTCHER, ADMIN',
    uploader_id BIGINT NOT NULL,
    media_type VARCHAR(20) NOT NULL COMMENT 'PHOTO, VIDEO',
    media_url VARCHAR(500) NOT NULL,
    description VARCHAR(255),
    dish_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_related (related_type, related_id),
    INDEX idx_dish_name (dish_name)
);
