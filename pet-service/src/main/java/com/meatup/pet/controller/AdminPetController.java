package com.meatup.pet.controller;

import com.meatup.pet.dto.PetSubscriptionResponse;
import com.meatup.pet.service.PetSubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/pet")
public class AdminPetController {

    @Autowired
    private PetSubscriptionService petSubscriptionService;

    @GetMapping("/subscriptions")
    public ResponseEntity<List<PetSubscriptionResponse>> getAllSubscriptions() {
        return ResponseEntity.ok(petSubscriptionService.getAllSubscriptions());
    }
}
