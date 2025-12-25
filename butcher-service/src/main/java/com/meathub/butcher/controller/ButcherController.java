package com.meathub.butcher.controller;

import com.meathub.butcher.dto.ButcherOnboardRequest;
import com.meathub.butcher.dto.ButcherResponse;
import com.meathub.butcher.dto.NearbyButcherResponse;
import com.meathub.butcher.dto.UpdateLocationRequest;
import com.meathub.butcher.service.ButcherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/butchers")
public class ButcherController {

    @Autowired
    private ButcherService butcherService;

    @PostMapping("/onboard")
    public ResponseEntity<ButcherResponse> onboard(@Valid @RequestBody ButcherOnboardRequest request) {
        ButcherResponse response = butcherService.onboard(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<ButcherResponse> getMyProfile() {
        ButcherResponse response = butcherService.getMyProfile();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<ButcherResponse> updateMyProfile(@Valid @RequestBody ButcherOnboardRequest request) {
        ButcherResponse response = butcherService.updateMyProfile(request);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/me/location")
    public ResponseEntity<ButcherResponse> updateLocation(@Valid @RequestBody UpdateLocationRequest request) {
        ButcherResponse response = butcherService.updateLocation(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/nearby")
    public ResponseEntity<List<NearbyButcherResponse>> getNearbyButchers(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(required = false) Double radius) {
        List<NearbyButcherResponse> butchers = butcherService.getNearbyButchers(lat, lng, radius);
        return ResponseEntity.ok(butchers);
    }
    
    @GetMapping("/{butcherId}")
    public ResponseEntity<ButcherResponse> getButcherById(@PathVariable Long butcherId) {
        ButcherResponse response = butcherService.getButcherById(butcherId);
        return ResponseEntity.ok(response);
    }
}
