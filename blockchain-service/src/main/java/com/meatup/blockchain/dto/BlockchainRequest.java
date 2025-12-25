package com.meatup.blockchain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockchainRequest {
    private Long orderId;
    private String recordType; // MEDIA, BATCH
    private String dataToVerify; // URL or JSON string
}
