package com.meatup.blockchain.service;

import com.meatup.blockchain.dto.BlockchainRequest;
import com.meatup.blockchain.entity.BlockchainRecord;
import com.meatup.blockchain.repository.BlockchainRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

import java.util.UUID;
import java.util.List;

@Service
public class BlockchainService {

    @Autowired
    private BlockchainRecordRepository repository;

    @Autowired
    private HashService hashService;

    // Web3j instance
    // private final Web3j web3j = Web3j.build(new
    // HttpService("https://rpc-mumbai.maticvigil.com"));

    public BlockchainRecord recordTransaction(BlockchainRequest request) {
        String dataHash = hashService.generateHash(request.getDataToVerify());

        // In a real implementation:
        // 1. Load Credential (private key)
        // 2. Create Transaction with dataHash as input data
        // 3. Send via web3j
        // 4. Get TxHash

        // Simulating Blockchain Transaction for Robustness (avoiding timeout/key issues
        // in build)
        String mockTxHash = "0x" + UUID.randomUUID().toString().replace("-", "") + "..." + System.currentTimeMillis();

        BlockchainRecord record = new BlockchainRecord();
        record.setOrderId(request.getOrderId());
        record.setRecordType(request.getRecordType());
        record.setDataHash(dataHash);
        record.setTransactionHash(mockTxHash);
        record.setStatus("CONFIRMED"); // Simulated confirmation

        return repository.save(record);
    }

    public boolean verifyRecord(Long orderId, String dataToVerify) {
        String calculatedHash = hashService.generateHash(dataToVerify);
        List<BlockchainRecord> records = repository.findByOrderId(orderId);

        return records.stream()
                .anyMatch(r -> r.getDataHash().equals(calculatedHash));
    }

    public List<BlockchainRecord> getRecords(Long orderId) {
        return repository.findByOrderId(orderId);
    }
}
