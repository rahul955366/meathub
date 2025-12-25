package com.meathub.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long meatItemId;
    private Long butcherId;
    private String meatItemName;
    private BigDecimal quantity;
    private BigDecimal price;
    private String unit;
    private BigDecimal subtotal;
}
