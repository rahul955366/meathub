package com.meatup.pet.controller;

import com.meatup.pet.dto.PetProductRequest;
import com.meatup.pet.dto.PetSubscriptionRequest;
import com.meatup.pet.dto.PetSubscriptionResponse;
import com.meatup.pet.entity.PetProduct;
import com.meatup.pet.service.PetProductService;
import com.meatup.pet.service.PetSubscriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pet")
public class PetController {

    @Autowired
    private PetProductService petProductService;

    @Autowired
    private PetSubscriptionService petSubscriptionService;

    // --- Product Endpoints ---

    @GetMapping("/products")
    public ResponseEntity<List<PetProduct>> getAllProducts() {
        return ResponseEntity.ok(petProductService.getAllAvailableProducts());
    }

    @PostMapping("/products")
    public ResponseEntity<PetProduct> createProduct(@Valid @RequestBody PetProductRequest request) {
        return new ResponseEntity<>(petProductService.createProduct(request), HttpStatus.CREATED);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<PetProduct> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody PetProductRequest request) {
        return ResponseEntity.ok(petProductService.updateProduct(id, request));
    }

    @GetMapping("/products/my")
    public ResponseEntity<List<PetProduct>> getMyProducts() {
        return ResponseEntity.ok(petProductService.getMyProducts());
    }

    // --- Subscription Endpoints ---

    @PostMapping("/subscribe")
    public ResponseEntity<PetSubscriptionResponse> subscribe(@Valid @RequestBody PetSubscriptionRequest request) {
        return new ResponseEntity<>(petSubscriptionService.createSubscription(request), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<PetSubscriptionResponse>> getMySubscriptions() {
        return ResponseEntity.ok(petSubscriptionService.getMySubscriptions());
    }

    @PutMapping("/{id}/pause")
    public ResponseEntity<PetSubscriptionResponse> pauseSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(petSubscriptionService.pauseSubscription(id));
    }

    @PutMapping("/{id}/resume")
    public ResponseEntity<PetSubscriptionResponse> resumeSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(petSubscriptionService.resumeSubscription(id));
    }
}
