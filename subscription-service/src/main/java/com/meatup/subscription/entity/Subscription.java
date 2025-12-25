package com.meatup.subscription.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

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

    @Column(nullable = false, precision = 10, scale = 2)
    private java.math.BigDecimal quantityKg;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SubscriptionPeriod period = SubscriptionPeriod.WEEKLY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DeliveryOption deliveryOption; // WEDNESDAY_SUNDAY, SUNDAY_ONLY

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private DayOfWeek primaryDayOfWeek; // SUNDAY, WEDNESDAY

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private DayOfWeek secondaryDayOfWeek; // For WEDNESDAY_SUNDAY option

    @Column(length = 10)
    private LocalTime deliveryTime; // Preferred delivery time (not for Sunday Special)

    @Column(nullable = false)
    private Boolean isSundaySpecial = false; // Sunday Special: 7-9 AM only

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private LocalDate nextRunDate;

    @Column(length = 255)
    private String deliveryAddress;

    @Column(length = 15)
    private String deliveryPhone;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private Boolean notifyIfNotHome = false; // User wants to be notified if not at home

    @Column(nullable = false, precision = 10, scale = 2)
    private java.math.BigDecimal subscriptionPrice; // Price for this subscription plan

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime pausedAt;
    private LocalDateTime lastExecutedAt;

    public enum SubscriptionPeriod {
        WEEKLY,   // Weekly subscription
        MONTHLY,  // Monthly subscription
        YEARLY    // Yearly subscription
    }

    public enum DeliveryOption {
        WEDNESDAY_SUNDAY, // Wednesday + Sunday delivery
        SUNDAY_ONLY       // Only Sunday delivery
    }

    public void pause() {
        this.active = false;
        this.pausedAt = LocalDateTime.now();
    }

    public void resume() {
        this.active = true;
        this.pausedAt = null;
    }

    public void updateNextRunDate() {
        LocalDate today = LocalDate.now();
        LocalDate nextDate = null;

        if (isSundaySpecial) {
            // Sunday Special: Always on Sunday, 7-9 AM
            nextDate = today.with(DayOfWeek.SUNDAY);
            if (nextDate.isBefore(today) || nextDate.isEqual(today)) {
                nextDate = nextDate.plusWeeks(1);
            }
        } else if (deliveryOption == DeliveryOption.WEDNESDAY_SUNDAY) {
            // Find next Wednesday or Sunday (whichever comes first)
            LocalDate nextWednesday = today.with(DayOfWeek.WEDNESDAY);
            LocalDate nextSunday = today.with(DayOfWeek.SUNDAY);

            if (nextWednesday.isBefore(today) || nextWednesday.isEqual(today)) {
                nextWednesday = nextWednesday.plusWeeks(1);
            }
            if (nextSunday.isBefore(today) || nextSunday.isEqual(today)) {
                nextSunday = nextSunday.plusWeeks(1);
            }

            nextDate = nextWednesday.isBefore(nextSunday) ? nextWednesday : nextSunday;
        } else if (deliveryOption == DeliveryOption.SUNDAY_ONLY) {
            // Only Sunday
            nextDate = today.with(DayOfWeek.SUNDAY);
            if (nextDate.isBefore(today) || nextDate.isEqual(today)) {
                nextDate = nextDate.plusWeeks(1);
            }
        }

        if (nextDate == null) {
            // Fallback: use primary day
            if (primaryDayOfWeek != null) {
                nextDate = today.with(primaryDayOfWeek);
                if (nextDate.isBefore(today) || nextDate.isEqual(today)) {
                    nextDate = nextDate.plusWeeks(1);
                }
            } else {
                nextDate = today.plusDays(1);
            }
        }

        this.nextRunDate = nextDate;
    }
}
