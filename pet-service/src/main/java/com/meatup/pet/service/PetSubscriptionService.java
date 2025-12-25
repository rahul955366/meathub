package com.meatup.pet.service;

import com.meatup.pet.dto.PetSubscriptionRequest;
import com.meatup.pet.dto.PetSubscriptionResponse;
import com.meatup.pet.entity.PetProduct;
import com.meatup.pet.entity.PetSubscription;
import com.meatup.pet.exception.SubscriptionNotFoundException;
import com.meatup.pet.exception.UnauthorizedException;
import com.meatup.pet.repository.PetSubscriptionRepository;
import com.meatup.pet.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PetSubscriptionService {

    @Autowired
    private PetSubscriptionRepository petSubscriptionRepository;

    @Autowired
    private PetProductService petProductService;

    @Transactional
    public PetSubscriptionResponse createSubscription(PetSubscriptionRequest request) {
        Long userId = getCurrentUserId();

        PetProduct product = petProductService.getProductById(request.getProductId());

        PetSubscription subscription = new PetSubscription();
        subscription.setUserId(userId);
        subscription.setPetType(request.getPetType());
        subscription.setProductId(product.getId());
        subscription.setProductName(product.getName());
        subscription.setQuantityKg(request.getQuantityKg());
        subscription.setScheduleType(request.getScheduleType());
        subscription.setDeliveryAddress(request.getDeliveryAddress());
        subscription.setActive(true);

        // Calculate initial delivery date
        subscription.updateNextDeliveryDate();
        // If calculated date is today (logic in entity is simplified), we might want to
        // push it
        // Ideally: if creating today, maybe delivery starts tomorrow or next interval
        // For simplicity, let's assume updateNextDeliveryDate logic sets it correctly
        // for next run

        PetSubscription saved = petSubscriptionRepository.save(subscription);
        return mapToResponse(saved);
    }

    public List<PetSubscriptionResponse> getMySubscriptions() {
        Long userId = getCurrentUserId();
        return petSubscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PetSubscriptionResponse pauseSubscription(Long id) {
        PetSubscription sub = getSubscriptionAndVerifyOwner(id);
        sub.pause();
        return mapToResponse(petSubscriptionRepository.save(sub));
    }

    @Transactional
    public PetSubscriptionResponse resumeSubscription(Long id) {
        PetSubscription sub = getSubscriptionAndVerifyOwner(id);
        sub.resume();
        return mapToResponse(petSubscriptionRepository.save(sub));
    }

    public List<PetSubscriptionResponse> getAllSubscriptions() {
        return petSubscriptionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PetSubscription getSubscriptionAndVerifyOwner(Long id) {
        PetSubscription sub = petSubscriptionRepository.findById(id)
                .orElseThrow(() -> new SubscriptionNotFoundException("Subscription not found"));

        Long userId = getCurrentUserId();
        if (!sub.getUserId().equals(userId)) {
            throw new UnauthorizedException("Not authorized to access this subscription");
        }
        return sub;
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userPrincipal.getUserId();
    }

    private PetSubscriptionResponse mapToResponse(PetSubscription sub) {
        PetSubscriptionResponse response = new PetSubscriptionResponse();
        response.setId(sub.getId());
        response.setUserId(sub.getUserId());
        response.setPetType(sub.getPetType());
        response.setProductId(sub.getProductId());
        response.setProductName(sub.getProductName());
        response.setQuantityKg(sub.getQuantityKg());
        response.setScheduleType(sub.getScheduleType());
        response.setActive(sub.getActive());
        response.setNextDeliveryDate(sub.getNextDeliveryDate());
        response.setDeliveryAddress(sub.getDeliveryAddress());
        response.setCreatedAt(sub.getCreatedAt());
        response.setUpdatedAt(sub.getUpdatedAt());
        response.setPausedAt(sub.getPausedAt());
        response.setLastExecutedAt(sub.getLastExecutedAt());
        return response;
    }
}
