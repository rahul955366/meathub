package com.meatup.subscription.dto;

import com.meatup.subscription.entity.Subscription;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSubscriptionRequest {

    @NotNull(message = "Butcher ID is required")
    private Long butcherId;

    @NotNull(message = "Meat item ID is required")
    private Long meatItemId;

    @NotBlank(message = "Meat item name is required")
    @Size(max = 100, message = "Meat item name must not exceed 100 characters")
    private String meatItemName;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.5", message = "Quantity must be at least 0.5 kg")
    private BigDecimal quantityKg;

    @NotNull(message = "Subscription period is required")
    private Subscription.SubscriptionPeriod period; // WEEKLY, MONTHLY, YEARLY

    @NotNull(message = "Delivery option is required")
    private Subscription.DeliveryOption deliveryOption; // WEDNESDAY_SUNDAY, SUNDAY_ONLY

    private LocalTime deliveryTime; // Preferred delivery time (not for Sunday Special)

    @NotNull(message = "Is Sunday Special flag is required")
    private Boolean isSundaySpecial = false; // Sunday Special: 7-9 AM only

    @NotBlank(message = "Delivery address is required")
    @Size(max = 255, message = "Delivery address must not exceed 255 characters")
    private String deliveryAddress;

    @NotBlank(message = "Delivery phone is required")
    @Size(max = 15, message = "Delivery phone must not exceed 15 characters")
    private String deliveryPhone;

    @NotNull(message = "Subscription price is required")
    @DecimalMin(value = "0.01", message = "Subscription price must be positive")
    private BigDecimal subscriptionPrice; // Price for this subscription plan

    @NotNull(message = "Notify if not home flag is required")
    private Boolean notifyIfNotHome = false; // User wants to be notified if not at home

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
}
