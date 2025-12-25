package com.meathub.order.dto;

import lombok.Data;

@Data
public class PaymentResponse {
    private String paymentId; // MEATHUB payment ID
    private String orderId; // MEATHUB order ID (if linked) - Changed to String for frontend compatibility
    private String subscriptionId; // MEATHUB subscription ID (if linked) - Changed to String for frontend compatibility
    private Double amount;
    private String currency;
    private String status; // created, authorized, captured, refunded, failed
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private String keyId; // Razorpay key ID for frontend
}

