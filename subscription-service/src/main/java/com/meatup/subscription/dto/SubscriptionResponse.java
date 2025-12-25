package com.meatup.subscription.dto;

import com.meatup.subscription.entity.Subscription;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {
    private Long id;
    private Long userId;
    private Long butcherId;
    private Long meatItemId;
    private String meatItemName;
    private BigDecimal quantityKg;
    private Subscription.SubscriptionPeriod period;
    private Subscription.DeliveryOption deliveryOption;
    private DayOfWeek primaryDayOfWeek;
    private DayOfWeek secondaryDayOfWeek;
    private LocalTime deliveryTime;
    private Boolean isSundaySpecial;
    private Boolean active;
    private LocalDate nextRunDate;
    private String deliveryAddress;
    private String deliveryPhone;
    private BigDecimal subscriptionPrice;
    private Boolean notifyIfNotHome;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime pausedAt;
    private LocalDateTime lastExecutedAt;
}
