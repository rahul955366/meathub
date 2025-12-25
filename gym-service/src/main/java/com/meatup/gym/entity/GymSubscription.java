package com.meatup.gym.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "gym_subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GymSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId; // From JWT

    @Column(nullable = false)
    private Long butcherId;

    @Column(nullable = false)
    private Long meatItemId;

    @Column(length = 100)
    private String meatItemName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProteinQuantity dailyQuantityKg;

    @Column(length = 10)
    private LocalTime deliveryTime = LocalTime.of(6, 0); // Default 6 AM

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private LocalDate nextDeliveryDate;

    @Column(length = 255)
    private String deliveryAddress;

    @Column(length = 15)
    private String deliveryPhone;

    @Column(length = 500)
    private String notes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime pausedAt;
    private LocalDateTime lastExecutedAt;

    public enum ProteinQuantity {
        SMALL(0.25), // 250g
        MEDIUM(0.5), // 500g
        LARGE(1.0); // 1kg

        private final double kgValue;

        ProteinQuantity(double kgValue) {
            this.kgValue = kgValue;
        }

        public double getKgValue() {
            return kgValue;
        }

        public int getGrams() {
            return (int) (kgValue * 1000);
        }
    }

    public void pause() {
        this.active = false;
        this.pausedAt = LocalDateTime.now();
    }

    public void resume() {
        this.active = true;
        this.pausedAt = null;
        updateNextDeliveryDate();
    }

    public void updateNextDeliveryDate() {
        LocalDate today = LocalDate.now();
        // If today's delivery hasn't happened yet, keep today. Otherwise, next day.
        if (nextDeliveryDate == null || nextDeliveryDate.isBefore(today)) {
            this.nextDeliveryDate = today;
        } else {
            this.nextDeliveryDate = today.plusDays(1);
        }
    }
}
