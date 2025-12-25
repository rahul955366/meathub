package com.meatup.gym.repository;

import com.meatup.gym.entity.GymSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface GymSubscriptionRepository extends JpaRepository<GymSubscription, Long> {
    List<GymSubscription> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<GymSubscription> findByActiveTrueAndNextDeliveryDateLessThanEqual(LocalDate date);

    List<GymSubscription> findAllByOrderByCreatedAtDesc();
}
