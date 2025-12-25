package com.meathub.butcher.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "butchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Butcher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId; // Links to User Service

    @Column(nullable = false)
    private String shopName;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String phoneNumber;

    private String description;

    // PENDING, APPROVED, REJECTED
    @Column(nullable = false)
    private String status;

    // Location fields for nearby butchers feature
    @Column(precision = 10)
    private Double latitude;

    @Column(precision = 10)
    private Double longitude;

    @Column(precision = 5)
    private Double serviceRadiusKm; // Default service radius in kilometers

    @Column(nullable = false)
    private Boolean isAvailable = true; // Whether butcher is currently accepting orders

    @CreationTimestamp
    private LocalDateTime createdAt;

    // Explicit Getters to resolve compilation issues
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
