package com.meathub.order.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {

    @NotNull(message = "Meat item ID is required")
    private Long meatItemId;

    @NotNull(message = "Butcher ID is required")
    private Long butcherId;

    @NotNull(message = "Meat item name is required")
    private String meatItemName;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.01", message = "Quantity must be at least 0.01")
    private BigDecimal quantity;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private String unit = "KG";
}
