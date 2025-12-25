package com.meatup.gym.dto;

import com.meatup.gym.entity.GymSubscription;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateGymPlanRequest {

    @NotNull(message = "Butcher ID is required")
    private Long butcherId;

    @NotNull(message = "Meat item ID is required")
    private Long meatItemId;

    @NotBlank(message = "Meat item name is required")
    @Size(max = 100, message = "Meat item name must not exceed 100 characters")
    private String meatItemName;

    @NotNull(message = "Daily quantity is required")
    private GymSubscription.ProteinQuantity dailyQuantityKg;

    private LocalTime deliveryTime; // Default will be 6 AM if not specified

    @NotBlank(message = "Delivery address is required")
    @Size(max = 255, message = "Delivery address must not exceed 255 characters")
    private String deliveryAddress;

    @NotBlank(message = "Delivery phone is required")
    @Size(max = 15, message = "Delivery phone must not exceed 15 characters")
    private String deliveryPhone;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
}
