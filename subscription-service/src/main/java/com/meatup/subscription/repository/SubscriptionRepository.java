package com.meatup.subscription.repository;

import com.meatup.subscription.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Subscription> findByButcherIdOrderByCreatedAtDesc(Long butcherId);

    List<Subscription> findByActiveTrueAndNextRunDateLessThanEqual(LocalDate date);

    List<Subscription> findAllByOrderByCreatedAtDesc();
}
