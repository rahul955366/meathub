package com.meatup.delivery.dto;

import com.meatup.delivery.entity.Delivery;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryResponse {
    private Long id;
    private Long orderId;
    private Long agentId;
    private String agentName;
    private String agentPhone;
    private Delivery.DeliveryStatus status;
    private String failureReason;
    private LocalDateTime assignedAt;
    private LocalDateTime updatedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime failedAt;
}
