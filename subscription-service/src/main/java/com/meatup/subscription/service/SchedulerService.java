package com.meatup.subscription.service;

import com.meatup.subscription.entity.Subscription;
import com.meatup.subscription.repository.SubscriptionRepository;
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
public class SchedulerService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Value("${scheduler.enabled:true}")
    private boolean schedulerEnabled;

    /**
     * Runs every hour to check for due subscriptions
     * Cron: 0 0 * * * * = At minute 0 of every hour
     */
    @Scheduled(cron = "${scheduler.cron:0 0 * * * *}")
    @Transactional
    public void processSubscriptions() {
        if (!schedulerEnabled) {
            log.debug("Scheduler is disabled");
            return;
        }

        log.info("Starting subscription scheduler...");

        LocalDate today = LocalDate.now();

        // Find all active subscriptions due for execution
        List<Subscription> dueSubscriptions = subscriptionRepository
                .findByActiveTrueAndNextRunDateLessThanEqual(today);

        log.info("Found {} subscriptions due for execution", dueSubscriptions.size());

        for (Subscription subscription : dueSubscriptions) {
            try {
                processSubscription(subscription);
            } catch (Exception e) {
                log.error("Failed to process subscription ID: {}. Error: {}",
                        subscription.getId(), e.getMessage(), e);
                // Continue with next subscription
            }
        }

        log.info("Subscription scheduler completed");
    }

    private void processSubscription(Subscription subscription) {
        log.info("Processing subscription ID: {} for user: {}",
                subscription.getId(), subscription.getUserId());

        // TODO: Call order-service to create order
        // For now, just logging and updating next run date

        try {
            // Future: REST call to order-service
            // OrderRequest orderRequest = buildOrderRequest(subscription);
            // restTemplate.postForObject(orderServiceUrl + "/orders/place", orderRequest,
            // OrderResponse.class);

            log.info("Would create order for subscription: {}", subscription.getId());
            log.info("  - User: {}", subscription.getUserId());
            log.info("  - Butcher: {}", subscription.getButcherId());
            log.info("  - Item: {} x {}kg", subscription.getMeatItemName(), subscription.getQuantityKg());
            log.info("  - Delivery: {}", subscription.getDeliveryAddress());

            // Update last executed timestamp
            subscription.setLastExecutedAt(LocalDateTime.now());

            // Calculate and update next run date
            subscription.updateNextRunDate();

            subscriptionRepository.save(subscription);

            log.info("Subscription ID: {} processed successfully. Next run: {}",
                    subscription.getId(), subscription.getNextRunDate());

        } catch (Exception e) {
            log.error("Error creating order for subscription ID: {}", subscription.getId(), e);
            throw e;
        }
    }

    /**
     * Manual trigger for testing - can be called via endpoint
     */
    public void triggerNow() {
        log.info("Manual subscription trigger initiated");
        processSubscriptions();
    }
}
