package com.meatup.blockchain.controller;

import com.meatup.blockchain.dto.BlockchainRequest;
import com.meatup.blockchain.entity.BlockchainRecord;
import com.meatup.blockchain.service.BlockchainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blockchain")
public class BlockchainController {

    @Autowired
    private BlockchainService blockchainService;

    @PostMapping("/record")
    public ResponseEntity<BlockchainRecord> record(@RequestBody BlockchainRequest request) {
        // In production: restrict to Admin/Butcher via Security
        return ResponseEntity.ok(blockchainService.recordTransaction(request));
    }

    @GetMapping("/verify/{orderId}")
    public ResponseEntity<List<BlockchainRecord>> getRecords(@PathVariable Long orderId) {
        return ResponseEntity.ok(blockchainService.getRecords(orderId));
    }
}
