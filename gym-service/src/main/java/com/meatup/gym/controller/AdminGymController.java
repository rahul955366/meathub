package com.meatup.gym.controller;

import com.meatup.gym.dto.GymSubscriptionResponse;
import com.meatup.gym.service.GymPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/gym")
public class AdminGymController {

    @Autowired
    private GymPlanService gymPlanService;

    @GetMapping("/subscriptions")
    public ResponseEntity<List<GymSubscriptionResponse>> getAllPlans() {
        List<GymSubscriptionResponse> plans = gymPlanService.getAllPlans();
        return ResponseEntity.ok(plans);
    }
}
