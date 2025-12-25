package com.meatup.blockchain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "blockchain_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockchainRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long orderId;

    @Column(nullable = false) // "MEDIA", "BATCH", "PACKING"
    private String recordType;

    @Column(nullable = false, length = 64) // SHA-256 hash
    private String dataHash;

    @Column(length = 66) // 0x... transaction hash
    private String transactionHash;

    @Column(nullable = false) // PENDING, CONFIRMED
    private String status;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
