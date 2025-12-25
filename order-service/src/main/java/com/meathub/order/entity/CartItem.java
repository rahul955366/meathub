package com.meathub.order.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonIgnore
    private Cart cart;

    @Column(nullable = false)
    private Long meatItemId; // Reference to butcher-service meat item

    @Column(nullable = false)
    private Long butcherId; // For grouping orders by butcher

    @Column(nullable = false, length = 100)
    private String meatItemName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity; // In kg or units (supports decimals like 0.5, 0.25, etc.)

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price; // Price per unit at time of adding to cart

    @Column(length = 50)
    private String unit = "KG";
}
