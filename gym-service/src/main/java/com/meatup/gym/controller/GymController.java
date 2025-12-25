package com.meatup.gym.controller;

import com.meatup.gym.dto.CreateGymPlanRequest;
import com.meatup.gym.dto.GymSubscriptionResponse;
import com.meatup.gym.service.GymPlanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gym")
public class GymController {

    @Autowired
    private GymPlanService gymPlanService;

    @PostMapping("/subscribe")
    public ResponseEntity<GymSubscriptionResponse> createPlan(
            @Valid @RequestBody CreateGymPlanRequest request) {
        GymSubscriptionResponse response = gymPlanService.createPlan(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<GymSubscriptionResponse>> getMyPlans() {
        List<GymSubscriptionResponse> plans = gymPlanService.getMyPlans();
        return ResponseEntity.ok(plans);
    }

    @PutMapping("/{id}/pause")
    public ResponseEntity<GymSubscriptionResponse> pausePlan(@PathVariable Long id) {
        GymSubscriptionResponse response = gymPlanService.pausePlan(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/resume")
    public ResponseEntity<GymSubscriptionResponse> resumePlan(@PathVariable Long id) {
        GymSubscriptionResponse response = gymPlanService.resumePlan(id);
        return ResponseEntity.ok(response);
    }
}
