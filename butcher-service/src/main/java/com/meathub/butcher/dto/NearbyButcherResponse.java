package com.meathub.butcher.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NearbyButcherResponse {
    private Long id;
    private String shopName;
    private String address;
    private String phoneNumber;
    private String description;
    private Double distanceKm; // Distance from user location
    private Double latitude;
    private Double longitude;
    private Double serviceRadiusKm;
    private Boolean isAvailable;
    private String status;
    // Rating can be added later if rating system exists
    private Double rating;
    private Integer totalRatings;
}

