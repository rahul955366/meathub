package com.meatup.gateway.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
@Slf4j
public class FallbackController {

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> userServiceFallback() {
        log.warn("User service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("User service is temporarily unavailable. Please try again later.");
    }

    @GetMapping("/butcher")
    public ResponseEntity<Map<String, Object>> butcherServiceFallback() {
        log.warn("Butcher service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("Product catalog is temporarily unavailable. Please try again later.");
    }

    @GetMapping("/order")
    public ResponseEntity<Map<String, Object>> orderServiceFallback() {
        log.warn("Order service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("Order service is temporarily unavailable. Please try again later.");
    }

    @GetMapping("/cart")
    public ResponseEntity<Map<String, Object>> cartServiceFallback() {
        log.warn("Cart service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("Shopping cart is temporarily unavailable. Your items are saved locally.");
    }

    @GetMapping("/payment")
    public ResponseEntity<Map<String, Object>> paymentServiceFallback() {
        log.warn("Payment service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("Payment processing is temporarily unavailable. Please try again later.");
    }

    @GetMapping("/review")
    public ResponseEntity<Map<String, Object>> reviewServiceFallback() {
        log.warn("Review service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("Review service is temporarily unavailable.");
    }

    @GetMapping("/subscription")
    public ResponseEntity<Map<String, Object>> subscriptionServiceFallback() {
        log.warn("Subscription service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("Subscription service is temporarily unavailable. Please try again later.");
    }

    @GetMapping("/delivery")
    public ResponseEntity<Map<String, Object>> deliveryServiceFallback() {
        log.warn("Delivery service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("Delivery tracking is temporarily unavailable.");
    }

    @GetMapping("/gym")
    public ResponseEntity<Map<String, Object>> gymServiceFallback() {
        log.warn("Gym service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("Gym products are temporarily unavailable.");
    }

    @GetMapping("/pet")
    public ResponseEntity<Map<String, Object>> petServiceFallback() {
        log.warn("Pet service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("Pet products are temporarily unavailable.");
    }

    @GetMapping("/media")
    public ResponseEntity<Map<String, Object>> mediaServiceFallback() {
        log.warn("Media service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("Media service is temporarily unavailable.");
    }

    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> adminServiceFallback() {
        log.warn("Admin service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("Admin services are temporarily unavailable.");
    }

    @GetMapping("/notification")
    public ResponseEntity<Map<String, Object>> notificationServiceFallback() {
        log.warn("Notification service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("Notification service is temporarily unavailable.");
    }

    @GetMapping("/ai")
    public ResponseEntity<Map<String, Object>> aiServiceFallback() {
        log.warn("AI service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("AI assistant is temporarily unavailable. Please try again later.");
    }

    @GetMapping("/blockchain")
    public ResponseEntity<Map<String, Object>> blockchainServiceFallback() {
        log.warn("Blockchain service is currently unavailable - circuit breaker activated");
        return createFallbackResponse("Blockchain verification is temporarily unavailable.");
    }

    private ResponseEntity<Map<String, Object>> createFallbackResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
        response.put("error", "Service Unavailable");
        response.put("message", message);
        response.put("fallback", true);

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }
}
