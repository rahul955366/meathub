package com.meatup.gym.service;

import com.meatup.gym.dto.CreateGymPlanRequest;
import com.meatup.gym.dto.GymSubscriptionResponse;
import com.meatup.gym.entity.GymSubscription;
import com.meatup.gym.exception.GymSubscriptionNotFoundException;
import com.meatup.gym.exception.UnauthorizedException;
import com.meatup.gym.repository.GymSubscriptionRepository;
import com.meatup.gym.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GymPlanService {

    @Autowired
    private GymSubscriptionRepository gymSubscriptionRepository;

    @Transactional
    public GymSubscriptionResponse createPlan(CreateGymPlanRequest request) {
        Long userId = getCurrentUserId();

        GymSubscription subscription = new GymSubscription();
        subscription.setUserId(userId);
        subscription.setButcherId(request.getButcherId());
        subscription.setMeatItemId(request.getMeatItemId());
        subscription.setMeatItemName(request.getMeatItemName());
        subscription.setDailyQuantityKg(request.getDailyQuantityKg());

        // Default to 6 AM if not provided
        subscription
                .setDeliveryTime(request.getDeliveryTime() != null ? request.getDeliveryTime() : LocalTime.of(6, 0));

        subscription.setActive(true);
        subscription.setDeliveryAddress(request.getDeliveryAddress());
        subscription.setDeliveryPhone(request.getDeliveryPhone());
        subscription.setNotes(request.getNotes());

        // Calculate first run date (Today if created before delivery time, else
        // Tomorrow)
        subscription.updateNextDeliveryDate();

        GymSubscription savedSubscription = gymSubscriptionRepository.save(subscription);
        return mapToResponse(savedSubscription);
    }

    public List<GymSubscriptionResponse> getMyPlans() {
        Long userId = getCurrentUserId();
        List<GymSubscription> subscriptions = gymSubscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return subscriptions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public GymSubscriptionResponse pausePlan(Long planId) {
        Long userId = getCurrentUserId();

        GymSubscription subscription = gymSubscriptionRepository.findById(planId)
                .orElseThrow(() -> new GymSubscriptionNotFoundException("Gym plan not found"));

        if (!subscription.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to modify this plan");
        }

        subscription.pause();
        GymSubscription savedSubscription = gymSubscriptionRepository.save(subscription);
        return mapToResponse(savedSubscription);
    }

    @Transactional
    public GymSubscriptionResponse resumePlan(Long planId) {
        Long userId = getCurrentUserId();

        GymSubscription subscription = gymSubscriptionRepository.findById(planId)
                .orElseThrow(() -> new GymSubscriptionNotFoundException("Gym plan not found"));

        if (!subscription.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to modify this plan");
        }

        subscription.resume();
        GymSubscription savedSubscription = gymSubscriptionRepository.save(subscription);
        return mapToResponse(savedSubscription);
    }

    public List<GymSubscriptionResponse> getAllPlans() {
        List<GymSubscription> subscriptions = gymSubscriptionRepository.findAllByOrderByCreatedAtDesc();
        return subscriptions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Long getCurrentUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getPrincipal() == null) {
                System.err.println("DEBUG: Authentication is null or principal is null");
                throw new UnauthorizedException("User not authenticated");
            }
            if (!(auth.getPrincipal() instanceof UserPrincipal)) {
                System.err.println("DEBUG: Principal is not UserPrincipal: " + auth.getPrincipal().getClass().getName());
                throw new UnauthorizedException("Invalid authentication principal");
            }
            UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
            return userPrincipal.getUserId();
        } catch (Exception e) {
            System.err.println("DEBUG: Exception in getCurrentUserId: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            throw new UnauthorizedException("Authentication error: " + e.getMessage());
        }
    }

    private GymSubscriptionResponse mapToResponse(GymSubscription subscription) {
        GymSubscriptionResponse response = new GymSubscriptionResponse();
        response.setId(subscription.getId());
        response.setUserId(subscription.getUserId());
        response.setButcherId(subscription.getButcherId());
        response.setMeatItemId(subscription.getMeatItemId());
        response.setMeatItemName(subscription.getMeatItemName());
        response.setDailyQuantityKg(subscription.getDailyQuantityKg());
        response.setDailyQuantityGrams(subscription.getDailyQuantityKg().getGrams());
        response.setDeliveryTime(subscription.getDeliveryTime());
        response.setActive(subscription.getActive());
        response.setNextDeliveryDate(subscription.getNextDeliveryDate());
        response.setDeliveryAddress(subscription.getDeliveryAddress());
        response.setDeliveryPhone(subscription.getDeliveryPhone());
        response.setNotes(subscription.getNotes());
        response.setCreatedAt(subscription.getCreatedAt());
        response.setUpdatedAt(subscription.getUpdatedAt());
        response.setPausedAt(subscription.getPausedAt());
        response.setLastExecutedAt(subscription.getLastExecutedAt());
        return response;
    }
}
