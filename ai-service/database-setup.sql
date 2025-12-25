-- MEATHUB Chat Database
CREATE DATABASE IF NOT EXISTS meathub_ai;
USE meathub_ai;

CREATE TABLE IF NOT EXISTS chat_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_message TEXT,
    ai_response TEXT,
    detected_intent VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
);
