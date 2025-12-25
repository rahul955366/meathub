package com.meatup.pet.dto;

import com.meatup.pet.entity.PetProduct;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    private String name;

    @NotNull(message = "Product type is required")
    private PetProduct.ProductType type;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal pricePerKg;

    @NotNull(message = "Stock is required")
    @DecimalMin(value = "0.0", message = "Stock cannot be negative")
    private Double availableStockKg;
}
