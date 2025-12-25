package com.meatup.pet.dto;

import com.meatup.pet.entity.PetSubscription;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetSubscriptionResponse {
    private Long id;
    private Long userId;
    private PetSubscription.PetType petType;
    private Long productId;
    private String productName;
    private Double quantityKg;
    private PetSubscription.ScheduleType scheduleType;
    private Boolean active;
    private LocalDate nextDeliveryDate;
    private String deliveryAddress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime pausedAt;
    private LocalDateTime lastExecutedAt;
}
