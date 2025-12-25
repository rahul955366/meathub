package com.meatup.pet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pet_products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long butcherId; // Reference to butcher who owns this product

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductType type;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerKg;

    @Column(nullable = false, precision = 10, scale = 2)
    private Double availableStockKg;

    @Column(nullable = false)
    private Boolean isAvailable = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum ProductType {
        RAW,
        COOKED,
        BONES,
        ORGANS,
        MIX
    }
}
