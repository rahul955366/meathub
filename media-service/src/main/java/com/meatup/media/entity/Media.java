package com.meatup.media.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "media_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RelatedType relatedType;

    @Column(nullable = false)
    private Long relatedId; // Could be Order ID or Meat Item ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UploaderRole uploadedBy;

    @Column(nullable = false)
    private Long uploaderId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MediaType mediaType;

    @Column(nullable = false, length = 500)
    private String mediaUrl;

    @Column(length = 255)
    private String description;

    // For cooking videos, we might query by tag/dish name
    @Column(length = 100)
    private String dishName;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum RelatedType {
        ORDER,
        MEAT_ITEM,
        COOKING
    }

    public enum UploaderRole {
        BUTCHER,
        ADMIN
    }

    public enum MediaType {
        PHOTO,
        VIDEO
    }
}
