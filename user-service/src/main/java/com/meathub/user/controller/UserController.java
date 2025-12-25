package com.meathub.user.controller;

import com.meathub.user.dto.AddressRequest;
import com.meathub.user.dto.AddressResponse;
import com.meathub.user.dto.UserProfileRequest;
import com.meathub.user.dto.UserProfileResponse;
import com.meathub.user.service.AddressService;
import com.meathub.user.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private AddressService addressService;

    // ==================== User Profile Endpoints ====================

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(
            @RequestParam(required = false) Long userId) {
        UserProfileResponse profile = userProfileService.getProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody UserProfileRequest request) {
        UserProfileResponse profile = userProfileService.createOrUpdateProfile(request);
        return ResponseEntity.ok(profile);
    }

    // ==================== Address Endpoints ====================

    @GetMapping("/address")
    public ResponseEntity<List<AddressResponse>> getAllAddresses() {
        List<AddressResponse> addresses = addressService.getAllAddresses();
        return ResponseEntity.ok(addresses);
    }

    @PostMapping("/address")
    public ResponseEntity<AddressResponse> createAddress(
            @Valid @RequestBody AddressRequest request) {
        AddressResponse address = addressService.createAddress(request);
        return new ResponseEntity<>(address, HttpStatus.CREATED);
    }

    @PutMapping("/address/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request) {
        AddressResponse address = addressService.updateAddress(id, request);
        return ResponseEntity.ok(address);
    }

    @DeleteMapping("/address/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== Preferred Butcher Endpoints ====================

    @PostMapping("/preferred-butcher/{butcherId}")
    public ResponseEntity<UserProfileResponse> setPreferredButcher(@PathVariable Long butcherId) {
        UserProfileResponse profile = userProfileService.setPreferredButcher(butcherId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/preferred-butcher")
    public ResponseEntity<Long> getPreferredButcher() {
        Long butcherId = userProfileService.getPreferredButcher();
        return ResponseEntity.ok(butcherId);
    }

    @DeleteMapping("/preferred-butcher")
    public ResponseEntity<Void> removePreferredButcher() {
        userProfileService.removePreferredButcher();
        return ResponseEntity.noContent().build();
    }
}
