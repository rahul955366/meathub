package com.meatup.subscription.controller;

import com.meatup.subscription.dto.CreateSubscriptionRequest;
import com.meatup.subscription.dto.SubscriptionResponse;
import com.meatup.subscription.service.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<SubscriptionResponse> createSubscription(
            @Valid @RequestBody CreateSubscriptionRequest request) {
        SubscriptionResponse response = subscriptionService.createSubscription(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<SubscriptionResponse>> getMySubscriptions() {
        List<SubscriptionResponse> subscriptions = subscriptionService.getMySubscriptions();
        return ResponseEntity.ok(subscriptions);
    }

    @PutMapping("/{id}/pause")
    public ResponseEntity<SubscriptionResponse> pauseSubscription(@PathVariable Long id) {
        SubscriptionResponse response = subscriptionService.pauseSubscription(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/resume")
    public ResponseEntity<SubscriptionResponse> resumeSubscription(@PathVariable Long id) {
        SubscriptionResponse response = subscriptionService.resumeSubscription(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/butcher/subscriptions")
    public ResponseEntity<List<SubscriptionResponse>> getButcherSubscriptions() {
        List<SubscriptionResponse> subscriptions = subscriptionService.getButcherSubscriptions();
        return ResponseEntity.ok(subscriptions);
    }

    @GetMapping("/admin/subscriptions")
    public ResponseEntity<List<SubscriptionResponse>> getAllSubscriptions() {
        List<SubscriptionResponse> subscriptions = subscriptionService.getAllSubscriptions();
        return ResponseEntity.ok(subscriptions);
    }
}
