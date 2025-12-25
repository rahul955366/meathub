package com.meathub.order.repository;

import com.meathub.order.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMeatItemIdOrderByCreatedAtDesc(Long meatItemId);
    List<Review> findByButcherIdOrderByCreatedAtDesc(Long butcherId);
    Optional<Review> findByOrderIdAndMeatItemId(Long orderId, Long meatItemId);
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
}

