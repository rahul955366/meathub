package com.meatup.pet.repository;

import com.meatup.pet.entity.PetSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PetSubscriptionRepository extends JpaRepository<PetSubscription, Long> {
    List<PetSubscription> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<PetSubscription> findByActiveTrueAndNextDeliveryDateLessThanEqual(LocalDate date);

    List<PetSubscription> findAllByOrderByCreatedAtDesc();
}
