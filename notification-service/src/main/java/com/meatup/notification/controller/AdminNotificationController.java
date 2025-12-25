package com.meatup.notification.controller;

import com.meatup.notification.dto.NotificationResponse;
import com.meatup.notification.entity.Notification;
import com.meatup.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/notifications")
public class AdminNotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @PostMapping("/broadcast")
    public ResponseEntity<String> broadcast(@RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        String message = payload.get("message");
        String roleStr = payload.get("role"); // Optional target

        Notification.UserRole role = roleStr != null ? Notification.UserRole.valueOf(roleStr)
                : Notification.UserRole.USER;

        notificationService.broadcast(title, message, role);
        return ResponseEntity.ok("Broadcast initiated");
    }
}
