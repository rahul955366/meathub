package com.meatup.delivery.dto;

import com.meatup.delivery.entity.Delivery;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private Delivery.DeliveryStatus status;

    @Size(max = 255, message = "Failure reason must not exceed 255 characters")
    private String failureReason;
}
