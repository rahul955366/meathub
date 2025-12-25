package com.meathub.order.service;

import com.meathub.order.dto.CreateReviewRequest;
import com.meathub.order.dto.ReviewResponse;
import com.meathub.order.entity.Order;
import com.meathub.order.entity.Review;
import com.meathub.order.exception.OrderNotFoundException;
import com.meathub.order.repository.OrderRepository;
import com.meathub.order.repository.ReviewRepository;
import com.meathub.order.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request) {
        Long userId = getCurrentUserId();

        // Verify order exists and belongs to user
        Order order = orderRepository.findByIdAndUserId(request.getOrderId(), userId)
            .orElseThrow(() -> new OrderNotFoundException("Order not found or unauthorized"));

        // Check if order is delivered (can only review delivered orders)
        if (order.getStatus() != Order.OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("Can only review delivered orders");
        }

        // Check if review already exists for this order and item
        reviewRepository.findByOrderIdAndMeatItemId(request.getOrderId(), request.getMeatItemId())
            .ifPresent(review -> {
                throw new IllegalArgumentException("Review already exists for this order and item");
            });

        // Create review
        Review review = new Review();
        review.setOrderId(request.getOrderId());
        review.setUserId(userId);
        review.setButcherId(order.getButcherId());
        review.setMeatItemId(request.getMeatItemId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);
        return mapToResponse(savedReview);
    }

    public List<ReviewResponse> getReviewsByMeatItem(Long meatItemId) {
        List<Review> reviews = reviewRepository.findByMeatItemIdOrderByCreatedAtDesc(meatItemId);
        return reviews.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public List<ReviewResponse> getReviewsByButcher(Long butcherId) {
        List<Review> reviews = reviewRepository.findByButcherIdOrderByCreatedAtDesc(butcherId);
        return reviews.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public List<ReviewResponse> getMyReviews() {
        Long userId = getCurrentUserId();
        List<Review> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return reviews.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    private ReviewResponse mapToResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setOrderId(review.getOrderId());
        response.setUserId(review.getUserId());
        response.setButcherId(review.getButcherId());
        response.setMeatItemId(review.getMeatItemId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());
        response.setUpdatedAt(review.getUpdatedAt());
        // TODO: Fetch user name and meat item name from respective services
        return response;
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userPrincipal.getUserId();
    }
}

