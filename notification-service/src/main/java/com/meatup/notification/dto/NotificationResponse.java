package com.meatup.notification.dto;

import com.meatup.notification.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private Long userId;
    private Notification.UserRole role;
    private String title;
    private String message;
    private Notification.NotificationType type;
    private boolean read;
    private LocalDateTime createdAt;
}
