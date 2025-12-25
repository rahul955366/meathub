package com.meatup.gym.dto;

import com.meatup.gym.entity.GymSubscription;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GymSubscriptionResponse {
    private Long id;
    private Long userId;
    private Long butcherId;
    private Long meatItemId;
    private String meatItemName;
    private GymSubscription.ProteinQuantity dailyQuantityKg;
    private int dailyQuantityGrams;
    private LocalTime deliveryTime;
    private Boolean active;
    private LocalDate nextDeliveryDate;
    private String deliveryAddress;
    private String deliveryPhone;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime pausedAt;
    private LocalDateTime lastExecutedAt;
}
