package com.meatup.delivery.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignDeliveryRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Agent ID is required")
    private Long agentId;
}
