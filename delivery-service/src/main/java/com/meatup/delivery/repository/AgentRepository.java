package com.meatup.delivery.repository;

import com.meatup.delivery.entity.DeliveryAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgentRepository extends JpaRepository<DeliveryAgent, Long> {
    List<DeliveryAgent> findByActiveTrue();

    Optional<DeliveryAgent> findByPhone(String phone);

    boolean existsByPhone(String phone);
}
