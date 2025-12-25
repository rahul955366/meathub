package com.meathub.order.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private Long orderId;
    private Long userId;
    private String userName;
    private Long butcherId;
    private Long meatItemId;
    private String meatItemName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

