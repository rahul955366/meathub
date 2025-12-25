package com.meathub.order.dto;

import lombok.Data;

@Data
public class VerifyPaymentResponse {
    private Boolean verified;
    private Long orderId;
    private Long subscriptionId;
    private String message;
}

