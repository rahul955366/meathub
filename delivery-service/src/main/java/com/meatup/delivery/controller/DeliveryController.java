package com.meatup.delivery.controller;

import com.meatup.delivery.dto.AssignDeliveryRequest;
import com.meatup.delivery.dto.DeliveryResponse;
import com.meatup.delivery.dto.DeliveryStatusUpdateRequest;
import com.meatup.delivery.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    // Admin: Assign delivery
    @PostMapping("/deliveries/assign")
    public ResponseEntity<DeliveryResponse> assignDelivery(@Valid @RequestBody AssignDeliveryRequest request) {
        DeliveryResponse response = deliveryService.assignDelivery(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Admin: View all deliveries
    @GetMapping("/admin/deliveries")
    public ResponseEntity<List<DeliveryResponse>> getAllDeliveries() {
        List<DeliveryResponse> deliveries = deliveryService.getAllDeliveries();
        return ResponseEntity.ok(deliveries);
    }

    // Agent: View assigned deliveries (NOTE: In production, get agentId from user
    // principal)
    @GetMapping("/agent/deliveries")
    public ResponseEntity<List<DeliveryResponse>> getAgentDeliveries(@RequestParam Long agentId) {
        List<DeliveryResponse> deliveries = deliveryService.getAgentDeliveries(agentId);
        return ResponseEntity.ok(deliveries);
    }

    // Agent: Update delivery status
    @PutMapping("/deliveries/{id}/status")
    public ResponseEntity<DeliveryResponse> updateDeliveryStatus(
            @PathVariable Long id,
            @Valid @RequestBody DeliveryStatusUpdateRequest request) {
        DeliveryResponse response = deliveryService.updateDeliveryStatus(id, request);
        return ResponseEntity.ok(response);
    }

    // User: Track delivery by order ID
    @GetMapping("/deliveries/order/{orderId}")
    public ResponseEntity<DeliveryResponse> getDeliveryByOrderId(@PathVariable Long orderId) {
        DeliveryResponse response = deliveryService.getDeliveryByOrderId(orderId);
        return ResponseEntity.ok(response);
    }
}
