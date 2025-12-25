package com.meatup.subscription.service;

import com.meatup.subscription.dto.CreateSubscriptionRequest;
import com.meatup.subscription.dto.SubscriptionResponse;
import com.meatup.subscription.entity.Subscription;
import com.meatup.subscription.exception.SubscriptionNotFoundException;
import com.meatup.subscription.exception.UnauthorizedException;
import com.meatup.subscription.repository.SubscriptionRepository;
import com.meatup.subscription.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Transactional
    public SubscriptionResponse createSubscription(CreateSubscriptionRequest request) {
        Long userId = getCurrentUserId();

        Subscription subscription = new Subscription();
        subscription.setUserId(userId);
        subscription.setButcherId(request.getButcherId());
        subscription.setMeatItemId(request.getMeatItemId());
        subscription.setMeatItemName(request.getMeatItemName());
        subscription.setQuantityKg(request.getQuantityKg());
        subscription.setPeriod(request.getPeriod());
        subscription.setDeliveryOption(request.getDeliveryOption());
        
        // Set primary and secondary days based on delivery option
        if (request.getDeliveryOption() == Subscription.DeliveryOption.WEDNESDAY_SUNDAY) {
            subscription.setPrimaryDayOfWeek(java.time.DayOfWeek.WEDNESDAY);
            subscription.setSecondaryDayOfWeek(java.time.DayOfWeek.SUNDAY);
        } else {
            subscription.setPrimaryDayOfWeek(java.time.DayOfWeek.SUNDAY);
            subscription.setSecondaryDayOfWeek(null);
        }
        
        subscription.setDeliveryTime(request.getDeliveryTime());
        subscription.setIsSundaySpecial(request.getIsSundaySpecial());
        
        // For Sunday Special, delivery time is fixed (7-9 AM)
        if (request.getIsSundaySpecial()) {
            subscription.setDeliveryTime(null); // No preferred time for Sunday Special
        }
        
        subscription.setActive(true);
        subscription.setDeliveryAddress(request.getDeliveryAddress());
        subscription.setDeliveryPhone(request.getDeliveryPhone());
        subscription.setSubscriptionPrice(request.getSubscriptionPrice());
        subscription.setNotifyIfNotHome(request.getNotifyIfNotHome());
        subscription.setNotes(request.getNotes());

        // Calculate first run date
        subscription.updateNextRunDate();

        Subscription savedSubscription = subscriptionRepository.save(subscription);
        return mapToResponse(savedSubscription);
    }

    public List<SubscriptionResponse> getMySubscriptions() {
        Long userId = getCurrentUserId();
        List<Subscription> subscriptions = subscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return subscriptions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubscriptionResponse pauseSubscription(Long subscriptionId) {
        Long userId = getCurrentUserId();

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new SubscriptionNotFoundException("Subscription not found"));

        // Check ownership
        if (!subscription.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to modify this subscription");
        }

        subscription.pause();
        Subscription savedSubscription = subscriptionRepository.save(subscription);
        return mapToResponse(savedSubscription);
    }

    @Transactional
    public SubscriptionResponse resumeSubscription(Long subscriptionId) {
        Long userId = getCurrentUserId();

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new SubscriptionNotFoundException("Subscription not found"));

        // Check ownership
        if (!subscription.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to modify this subscription");
        }

        subscription.resume();
        subscription.updateNextRunDate(); // Recalculate next run
        Subscription savedSubscription = subscriptionRepository.save(subscription);
        return mapToResponse(savedSubscription);
    }

    public List<SubscriptionResponse> getButcherSubscriptions() {
        Long butcherId = getCurrentButcherId();
        List<Subscription> subscriptions = subscriptionRepository.findByButcherIdOrderByCreatedAtDesc(butcherId);
        return subscriptions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SubscriptionResponse> getAllSubscriptions() {
        List<Subscription> subscriptions = subscriptionRepository.findAllByOrderByCreatedAtDesc();
        return subscriptions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userPrincipal.getUserId();
    }

    private Long getCurrentButcherId() {
        // For now, using userId - in production would query butcher-service
        return getCurrentUserId();
    }

    private SubscriptionResponse mapToResponse(Subscription subscription) {
        SubscriptionResponse response = new SubscriptionResponse();
        response.setId(subscription.getId());
        response.setUserId(subscription.getUserId());
        response.setButcherId(subscription.getButcherId());
        response.setMeatItemId(subscription.getMeatItemId());
        response.setMeatItemName(subscription.getMeatItemName());
        response.setQuantityKg(subscription.getQuantityKg());
        response.setPeriod(subscription.getPeriod());
        response.setDeliveryOption(subscription.getDeliveryOption());
        response.setPrimaryDayOfWeek(subscription.getPrimaryDayOfWeek());
        response.setSecondaryDayOfWeek(subscription.getSecondaryDayOfWeek());
        response.setDeliveryTime(subscription.getDeliveryTime());
        response.setIsSundaySpecial(subscription.getIsSundaySpecial());
        response.setActive(subscription.getActive());
        response.setNextRunDate(subscription.getNextRunDate());
        response.setDeliveryAddress(subscription.getDeliveryAddress());
        response.setDeliveryPhone(subscription.getDeliveryPhone());
        response.setSubscriptionPrice(subscription.getSubscriptionPrice());
        response.setNotifyIfNotHome(subscription.getNotifyIfNotHome());
        response.setNotes(subscription.getNotes());
        response.setCreatedAt(subscription.getCreatedAt());
        response.setUpdatedAt(subscription.getUpdatedAt());
        response.setPausedAt(subscription.getPausedAt());
        response.setLastExecutedAt(subscription.getLastExecutedAt());
        return response;
    }
}
