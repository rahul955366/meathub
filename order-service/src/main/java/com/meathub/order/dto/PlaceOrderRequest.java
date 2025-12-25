package com.meathub.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceOrderRequest {

    @NotNull(message = "Butcher ID is required")
    private Long butcherId;

    @NotBlank(message = "Delivery address is required")
    @Size(max = 255, message = "Delivery address must not exceed 255 characters")
    private String deliveryAddress;

    @NotBlank(message = "Delivery phone is required")
    @Size(max = 15, message = "Delivery phone must not exceed 15 characters")
    private String deliveryPhone;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
}
