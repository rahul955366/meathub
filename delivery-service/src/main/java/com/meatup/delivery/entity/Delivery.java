package com.meatup.delivery.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long orderId; // Reference to order-service

    @Column(nullable = false)
    private Long agentId; // Reference to delivery agent

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DeliveryStatus status = DeliveryStatus.ASSIGNED;

    @Column(length = 255)
    private String failureReason;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime assignedAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime failedAt;

    public enum DeliveryStatus {
        ASSIGNED, // Delivery assigned to agent
        OUT_FOR_DELIVERY, // Agent picked up and on the way
        DELIVERED, // Successfully delivered
        FAILED // Delivery failed
    }

    public boolean canUpdateStatus(DeliveryStatus newStatus) {
        // Validate status transitions
        return switch (status) {
            case ASSIGNED -> newStatus == DeliveryStatus.OUT_FOR_DELIVERY ||
                    newStatus == DeliveryStatus.FAILED;
            case OUT_FOR_DELIVERY -> newStatus == DeliveryStatus.DELIVERED ||
                    newStatus == DeliveryStatus.FAILED;
            default -> false; // DELIVERED and FAILED are terminal states
        };
    }
}
