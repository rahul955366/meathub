package com.meatup.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryResponse {
    private long totalOrders;
    private Map<String, Long> statusDistribution;
}
