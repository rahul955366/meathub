package com.meatup.gym.service;

import com.meatup.gym.entity.GymSubscription;
import com.meatup.gym.repository.GymSubscriptionRepository;
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
public class GymSchedulerService {

    @Autowired
    private GymSubscriptionRepository gymSubscriptionRepository;

    @Value("${scheduler.enabled:true}")
    private boolean schedulerEnabled;

    @Value("${order.service.url}")
    private String orderServiceUrl;

    /**
     * Runs daily at 6 AM (or configured time)
     */
    @Scheduled(cron = "${scheduler.cron:0 0 6 * * *}")
    @Transactional
    public void processDailyGymOrders() {
        if (!schedulerEnabled) {
            log.debug("Gym Scheduler is disabled");
            return;
        }

        log.info("Starting Daily Gym Protein Scheduler...");

        LocalDate today = LocalDate.now();

        // Find all active subscriptions due today or before (catch-up)
        List<GymSubscription> duePlans = gymSubscriptionRepository
                .findByActiveTrueAndNextDeliveryDateLessThanEqual(today);

        log.info("Found {} gym plans due for today's protein delivery", duePlans.size());

        for (GymSubscription plan : duePlans) {
            try {
                processPlan(plan);
            } catch (Exception e) {
                log.error("Failed to process gym plan ID: {}. Error: {}",
                        plan.getId(), e.getMessage(), e);
            }
        }

        log.info("Gym Scheduler completed");
    }

    private void processPlan(GymSubscription plan) {
        log.info("Processing daily protein for User: {}, Plan ID: {}", plan.getUserId(), plan.getId());

        // TODO: Integration with Order Service
        /*
         * RestTemplate restTemplate = new RestTemplate();
         * CreateOrderRequest orderRequest = new CreateOrderRequest();
         * orderRequest.setButcherId(plan.getButcherId());
         * orderRequest.addItem(plan.getMeatItemId(),
         * plan.getDailyQuantityKg().getKgValue());
         * orderRequest.setGymOrder(true); // Special flag
         * 
         * restTemplate.postForObject(orderServiceUrl + "/orders/place", orderRequest,
         * OrderResponse.class);
         */

        log.info("Successfully created ORDER for {}g of {}",
                plan.getDailyQuantityKg().getGrams(), plan.getMeatItemName());

        // Update tracking
        plan.setLastExecutedAt(LocalDateTime.now());
        plan.updateNextDeliveryDate(); // Moves to tomorrow

        gymSubscriptionRepository.save(plan);
    }
}
