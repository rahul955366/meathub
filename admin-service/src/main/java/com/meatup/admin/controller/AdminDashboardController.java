package com.meatup.admin.controller;

import com.meatup.admin.dto.DashboardStatsResponse;
import com.meatup.admin.dto.OrderSummaryResponse;
import com.meatup.admin.dto.UserStatsResponse;
import com.meatup.admin.service.AdminAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminDashboardController {

    @Autowired
    private AdminAnalyticsService adminAnalyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminAnalyticsService.getDashboardStats());
    }

    @GetMapping("/orders/summary")
    public ResponseEntity<OrderSummaryResponse> getOrderSummary() {
        return ResponseEntity.ok(adminAnalyticsService.getOrderSummary());
    }

    @GetMapping("/users/stats")
    public ResponseEntity<UserStatsResponse> getUserStats() {
        return ResponseEntity.ok(adminAnalyticsService.getUserStats());
    }
}
