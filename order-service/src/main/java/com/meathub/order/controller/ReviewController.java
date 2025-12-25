package com.meathub.order.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.meathub.order.dto.CreateReviewRequest;
import com.meathub.order.dto.ReviewResponse;
import com.meathub.order.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Product review and rating APIs")
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "Create a review", description = "Submit a review and rating for a product from a delivered order")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Review created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request or order not delivered"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody CreateReviewRequest request) {
        ReviewResponse response = reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Get reviews for a product", description = "Retrieves all reviews for a specific meat item")
    @GetMapping("/meat-item/{meatItemId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByMeatItem(
            @Parameter(description = "Meat item ID") @PathVariable Long meatItemId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByMeatItem(meatItemId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/butcher/{butcherId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByButcher(@PathVariable Long butcherId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByButcher(butcherId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReviewResponse>> getMyReviews() {
        List<ReviewResponse> reviews = reviewService.getMyReviews();
        return ResponseEntity.ok(reviews);
    }
}

