package com.meatup.notification.service;

import com.meatup.notification.dto.NotificationRequest;
import com.meatup.notification.dto.NotificationResponse;
import com.meatup.notification.entity.Notification;
import com.meatup.notification.exception.NotificationNotFoundException;
import com.meatup.notification.repository.NotificationRepository;
import com.meatup.notification.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

    @Transactional
    public NotificationResponse sendNotification(NotificationRequest request) {
        // In reality, this might be triggered by RabbitMQ/Kafka listeners
        // Here we expose it as REST for inter-service communication

        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setRole(request.getRole());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType());
        notification.setRead(false);

        Notification saved = notificationRepository.save(notification);

        // Also trigger real-world notifications (Mocks for now, but ready for
        // integration)
        try {
            if (request.getType() == Notification.NotificationType.ORDER_STATUS) {
                // Email used as placeholder for "target address"
                emailService.sendOrderStatusUpdate("user_" + request.getUserId() + "@example.com", "ORDER_ID",
                        request.getMessage());
                smsService.sendStatusUpdate("PHONE_PLACEHOLDER", request.getMessage());
            }
        } catch (Exception e) {
            // Don't fail the whole notification if email fails
            System.err.println("Failed to send external notification: " + e.getMessage());
        }

        return mapToResponse(saved);
    }

    public List<NotificationResponse> getMyNotifications() {
        Long userId = getCurrentUserId();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationResponse markAsRead(Long id) {
        Long userId = getCurrentUserId();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            // Unless Admin? For now simple ownership check
            throw new AccessDeniedException("Not your notification");
        }

        notification.setRead(true);
        return mapToResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void broadcast(String title, String message, Notification.UserRole targetRole) {
        // This is simplified. In prod, efficient batch insert or fan-out needed.
        // For MVP, we might just store a "System" notification with null userId or
        // specialized Logic. For now, we will NOT implement full user iteration loop
        // to avoid performance kill. We will create a generic system entry.

        // Placeholder: Log for now since we don't have a fast way to get all User IDs
        // of a role
        // without calling user-service.
        System.out.println("BROADCAST [" + targetRole + "]: " + title + " - " + message);

        // Real implementation would:
        // 1. Fetch all user IDs of role from User Service
        // 2. Batch insert notifications
    }

    public List<NotificationResponse> getAllNotifications() {
        return notificationRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userPrincipal.getUserId();
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getUserId(),
                notification.getRole(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt());
    }
}
