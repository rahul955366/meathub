package com.meathub.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be at least 1")
    private Double amount; // in rupees

    private String currency = "INR";
    private Long orderId; // MEATHUB order ID (optional)
    private Long subscriptionId; // MEATHUB subscription ID (optional)
    private String description;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
}

