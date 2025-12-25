package com.meathub.order.dto;

import com.meathub.order.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long userId;
    private Long butcherId;
    private String butcherBusinessName;
    private List<OrderItemResponse> items;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private String deliveryAddress;
    private String deliveryPhone;
    private String notes;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime cancelledAt;
    private LocalDateTime deliveredAt;
}
