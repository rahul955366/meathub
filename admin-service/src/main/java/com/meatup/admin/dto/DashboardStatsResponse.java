package com.meatup.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    // Quick Counts
    private long totalUsers;
    private long totalButchers;
    private long totalOrders;

    // Revenue (Placeholder for future)
    private double totalRevenueToday;

    // Subscriptions
    private long activeWeeklySubscriptions;
    private long activeGymPlans;
    private long activePetSubscriptions;

    // Order Status Breakdown
    private Map<String, Long> orderStatusCounts;
}
