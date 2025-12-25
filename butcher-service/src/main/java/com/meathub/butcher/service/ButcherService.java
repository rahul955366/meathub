package com.meathub.butcher.service;

import com.meathub.butcher.dto.ButcherOnboardRequest;
import com.meathub.butcher.dto.ButcherResponse;
import com.meathub.butcher.dto.NearbyButcherResponse;
import com.meathub.butcher.dto.UpdateLocationRequest;
import com.meathub.butcher.entity.Butcher;
import com.meathub.butcher.exception.ButcherAlreadyExistsException;
import com.meathub.butcher.exception.ButcherNotFoundException;
import com.meathub.butcher.repository.ButcherRepository;
import com.meathub.butcher.repository.MeatItemRepository;
import com.meathub.butcher.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ButcherService {

    @Autowired
    private ButcherRepository butcherRepository;
    
    @Autowired
    private MeatItemRepository meatItemRepository;
    
    // Haversine formula to calculate distance between two coordinates
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in kilometers
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public ButcherResponse onboard(ButcherOnboardRequest request) {
        UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();

        if (butcherRepository.findByUserId(currentUser.getUserId()).isPresent()) {
            throw new ButcherAlreadyExistsException("Butcher profile already exists");
        }

        Butcher butcher = new Butcher();
        butcher.setUserId(currentUser.getUserId());
        butcher.setShopName(request.getShopName());
        butcher.setAddress(request.getAddress());
        butcher.setPhoneNumber(request.getPhoneNumber());
        butcher.setDescription(request.getDescription());
        butcher.setStatus("PENDING"); // Pending Admin Approval

        Butcher saved = butcherRepository.save(butcher);
        return mapToResponse(saved);
    }

    public ButcherResponse getMyProfile() {
        UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Butcher butcher = butcherRepository.findByUserId(currentUser.getUserId())
                .orElse(null);

        if (butcher == null)
            return null;
        return mapToResponse(butcher);
    }

    public ButcherResponse updateMyProfile(ButcherOnboardRequest request) {
        UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Butcher butcher = butcherRepository.findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new ButcherNotFoundException("Butcher profile not found"));

        butcher.setShopName(request.getShopName());
        butcher.setAddress(request.getAddress());
        butcher.setPhoneNumber(request.getPhoneNumber());
        butcher.setDescription(request.getDescription());

        Butcher saved = butcherRepository.save(butcher);
        return mapToResponse(saved);
    }

    public List<ButcherResponse> getAllButchers() {
        return butcherRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ButcherResponse approveButcher(Long id) {
        Butcher butcher = butcherRepository.findById(id)
                .orElseThrow(() -> new ButcherNotFoundException("Butcher not found"));
        butcher.setStatus("APPROVED");
        return mapToResponse(butcherRepository.save(butcher));
    }

    public ButcherResponse rejectButcher(Long id, String reason) {
        Butcher butcher = butcherRepository.findById(id)
                .orElseThrow(() -> new ButcherNotFoundException("Butcher not found"));
        butcher.setStatus("REJECTED");
        // in real world, store reason or notify user
        return mapToResponse(butcherRepository.save(butcher));
    }

    public List<NearbyButcherResponse> getNearbyButchers(Double latitude, Double longitude, Double radiusKm) {
        if (latitude == null || longitude == null) {
            throw new IllegalArgumentException("Latitude and longitude are required");
        }
        
        // Default radius to 10km if not provided
        Double searchRadius = radiusKm != null ? radiusKm : 10.0;
        
        List<Butcher> butchers = butcherRepository.findNearbyButchers(latitude, longitude, searchRadius);
        
        return butchers.stream().map(butcher -> {
            NearbyButcherResponse response = new NearbyButcherResponse();
            response.setId(butcher.getId());
            response.setShopName(butcher.getShopName());
            response.setAddress(butcher.getAddress());
            response.setPhoneNumber(butcher.getPhoneNumber());
            response.setDescription(butcher.getDescription());
            response.setLatitude(butcher.getLatitude());
            response.setLongitude(butcher.getLongitude());
            response.setServiceRadiusKm(butcher.getServiceRadiusKm());
            response.setIsAvailable(butcher.getIsAvailable());
            response.setStatus(butcher.getStatus());
            
            // Calculate distance
            double distance = calculateDistance(latitude, longitude, 
                    butcher.getLatitude(), butcher.getLongitude());
            response.setDistanceKm(Math.round(distance * 100.0) / 100.0); // Round to 2 decimal places
            
            // Rating can be added later when rating system is implemented
            response.setRating(null);
            response.setTotalRatings(0);
            
            return response;
        }).collect(Collectors.toList());
    }
    
    public ButcherResponse updateLocation(UpdateLocationRequest request) {
        UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Butcher butcher = butcherRepository.findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new ButcherNotFoundException("Butcher profile not found"));
        
        butcher.setLatitude(request.getLatitude());
        butcher.setLongitude(request.getLongitude());
        if (request.getServiceRadiusKm() != null) {
            butcher.setServiceRadiusKm(request.getServiceRadiusKm());
        }
        if (request.getIsAvailable() != null) {
            butcher.setIsAvailable(request.getIsAvailable());
        }
        
        Butcher saved = butcherRepository.save(butcher);
        return mapToResponse(saved);
    }
    
    public ButcherResponse getButcherById(Long butcherId) {
        Butcher butcher = butcherRepository.findById(butcherId)
                .orElseThrow(() -> new ButcherNotFoundException("Butcher not found"));
        return mapToResponse(butcher);
    }
    
    private ButcherResponse mapToResponse(Butcher butcher) {
        return new ButcherResponse(
                butcher.getId(),
                butcher.getUserId(),
                butcher.getShopName(),
                butcher.getAddress(),
                butcher.getPhoneNumber(),
                butcher.getDescription(),
                butcher.getStatus());
    }
}
