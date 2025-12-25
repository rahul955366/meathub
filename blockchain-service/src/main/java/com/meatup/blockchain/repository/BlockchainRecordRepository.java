package com.meatup.blockchain.repository;

import com.meatup.blockchain.entity.BlockchainRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlockchainRecordRepository extends JpaRepository<BlockchainRecord, Long> {
    List<BlockchainRecord> findByOrderId(Long orderId);
}
