package com.meatup.pet.service;

import com.meatup.pet.entity.PetSubscription;
import com.meatup.pet.repository.PetSubscriptionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class PetSchedulerService {

    @Autowired
    private PetSubscriptionRepository petSubscriptionRepository;

    @Value("${scheduler.enabled:true}")
    private boolean schedulerEnabled;

    @Value("${order.service.url}")
    private String orderServiceUrl;

    @Scheduled(cron = "${scheduler.cron:0 0 7 * * *}")
    @Transactional
    public void processPetSubscriptions() {
        if (!schedulerEnabled) {
            log.debug("Pet Scheduler is disabled");
            return;
        }

        log.info("Starting Daily Pet Subscription Scheduler...");

        LocalDate today = LocalDate.now();
        List<PetSubscription> dueSubscriptions = petSubscriptionRepository
                .findByActiveTrueAndNextDeliveryDateLessThanEqual(today);

        log.info("Found {} pet subscriptions due for processing", dueSubscriptions.size());

        for (PetSubscription sub : dueSubscriptions) {
            try {
                processSubscription(sub);
            } catch (Exception e) {
                log.error("Failed to process subscription ID: {}", sub.getId(), e);
            }
        }

        log.info("Pet Scheduler completed");
    }

    private void processSubscription(PetSubscription sub) {
        log.info("Processing pet food order for User: {}, Product: {}", sub.getUserId(), sub.getProductName());

        // Call Order Service (Mocked)
        /*
         * CreateOrderRequest request = new CreateOrderRequest();
         * request.setOrderType("PET");
         * request.addItem(sub.getProductId(), sub.getQuantityKg());
         * ...
         */

        // Update Subscription
        sub.setLastExecutedAt(LocalDateTime.now());
        sub.updateNextDeliveryDate();
        petSubscriptionRepository.save(sub);

        log.info("Successfully processed subscription ID: {}. Next run: {}", sub.getId(), sub.getNextDeliveryDate());
    }
}
