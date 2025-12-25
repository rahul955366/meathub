package com.meatup.pet.dto;

import com.meatup.pet.entity.PetSubscription;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetSubscriptionRequest {

    @NotNull(message = "Pet type is required")
    private PetSubscription.PetType petType;

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.1", message = "Minimum quantity is 0.1 kg")
    private Double quantityKg;

    @NotNull(message = "Schedule type is required")
    private PetSubscription.ScheduleType scheduleType;

    @NotBlank(message = "Delivery address is required")
    @Size(max = 255, message = "Delivery address must not exceed 255 characters")
    private String deliveryAddress;
}
