package com.meatup.pet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pet_subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PetType petType;

    @Column(nullable = false)
    private Long productId;

    @Column(length = 100)
    private String productName;

    @Column(nullable = false)
    private Double quantityKg;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ScheduleType scheduleType;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private LocalDate nextDeliveryDate;

    @Column(length = 255)
    private String deliveryAddress;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime pausedAt;
    private LocalDateTime lastExecutedAt;

    public enum PetType {
        DOG,
        CAT
    }

    public enum ScheduleType {
        DAILY,
        WEEKLY,
        MONTHLY
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
        if (nextDeliveryDate == null || nextDeliveryDate.isBefore(today)) {
            // Start today/tomorrow logic could be more complex, simplification:
            // If we're updating after an order, or on creation/resume
            if (scheduleType == ScheduleType.DAILY) {
                this.nextDeliveryDate = today.plusDays(1);
            } else if (scheduleType == ScheduleType.WEEKLY) {
                this.nextDeliveryDate = today.plusWeeks(1);
            } else if (scheduleType == ScheduleType.MONTHLY) {
                this.nextDeliveryDate = today.plusMonths(1);
            }
            return;
        }

        // Standard update after execution
        if (scheduleType == ScheduleType.DAILY) {
            this.nextDeliveryDate = nextDeliveryDate.plusDays(1);
        } else if (scheduleType == ScheduleType.WEEKLY) {
            this.nextDeliveryDate = nextDeliveryDate.plusWeeks(1);
        } else if (scheduleType == ScheduleType.MONTHLY) {
            this.nextDeliveryDate = nextDeliveryDate.plusMonths(1);
        }
    }
}
