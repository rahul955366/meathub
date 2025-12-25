package com.meathub.order.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.meathub.order.dto.PaymentRequest;
import com.meathub.order.dto.PaymentResponse;
import com.meathub.order.dto.VerifyPaymentRequest;
import com.meathub.order.dto.VerifyPaymentResponse;
import com.meathub.order.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payments", description = "Payment processing APIs")
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "Create payment order", description = "Creates a Razorpay order for payment processing")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Payment order created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPaymentOrder(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Verify payment", description = "Verifies payment signature and updates order status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment verified successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid signature or payment failed"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/verify")
    public ResponseEntity<VerifyPaymentResponse> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        VerifyPaymentResponse response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get payment details", description = "Retrieves payment information by payment ID")
    @GetMapping("/{paymentId}")
    public ResponseEntity<String> getPaymentDetails(@Parameter(description = "Payment ID") @PathVariable String paymentId) {
        // TODO: Implement payment details retrieval
        return ResponseEntity.ok("Details for payment ID: " + paymentId);
    }

    @Operation(summary = "Refund payment", description = "Initiates a refund for a payment")
    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<String> refundPayment(@Parameter(description = "Payment ID") @PathVariable String paymentId) {
        // TODO: Implement refund logic
        return ResponseEntity.ok("Refund initiated for payment ID: " + paymentId);
    }
}

