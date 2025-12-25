package com.meathub.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long meatItemId;
    private String meatItemName;
    private BigDecimal quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal subtotal;
    private String unit;
}
