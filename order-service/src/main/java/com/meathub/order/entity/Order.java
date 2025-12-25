package com.meathub.order.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String orderNumber; // e.g., ORD20241216001

    @Column(nullable = false)
    private Long userId; // From JWT

    @Column(nullable = false)
    private Long butcherId; // Orders are placed per butcher

    @Column(length = 100)
    private String butcherBusinessName;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(length = 255)
    private String deliveryAddress;

    @Column(length = 15)
    private String deliveryPhone;

    @Column(length = 500)
    private String notes;

    @Column(length = 255)
    private String cancellationReason;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime confirmedAt;
    private LocalDateTime cancelledAt;
    private LocalDateTime deliveredAt;

    public enum OrderStatus {
        PENDING, // Order placed, awaiting butcher confirmation
        CONFIRMED, // Butcher confirmed the order
        CUTTING, // Butcher is preparing the meat
        PACKED, // Order is packed and ready
        OUT_FOR_DELIVERY, // With delivery partner
        DELIVERED, // Successfully delivered
        CANCELLED // Order cancelled
    }

    public boolean canCancel() {
        // Can only cancel before cutting starts
        return status == OrderStatus.PENDING || status == OrderStatus.CONFIRMED;
    }

    public boolean canUpdateStatus(OrderStatus newStatus) {
        // Validate status transitions
        return switch (status) {
            case PENDING -> newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.CANCELLED;
            case CONFIRMED -> newStatus == OrderStatus.CUTTING || newStatus == OrderStatus.CANCELLED;
            case CUTTING -> newStatus == OrderStatus.PACKED;
            case PACKED -> newStatus == OrderStatus.OUT_FOR_DELIVERY;
            case OUT_FOR_DELIVERY -> newStatus == OrderStatus.DELIVERED;
            default -> false;
        };
    }
}
