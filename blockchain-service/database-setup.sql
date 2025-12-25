-- MEATHUB Blockchain Local Ledger
CREATE DATABASE IF NOT EXISTS meathub_blockchain;
USE meathub_blockchain;

CREATE TABLE IF NOT EXISTS blockchain_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    record_type VARCHAR(50) NOT NULL,
    data_hash VARCHAR(64) NOT NULL,
    transaction_hash VARCHAR(66),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id)
);
