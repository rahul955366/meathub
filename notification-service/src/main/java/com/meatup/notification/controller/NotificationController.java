package com.meatup.notification.controller;

import com.meatup.notification.dto.NotificationRequest;
import com.meatup.notification.dto.NotificationResponse;
import com.meatup.notification.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<NotificationResponse> sendNotification(@Valid @RequestBody NotificationRequest request) {
        // Technically this should be secured so only internal services or admins can
        // call it with arbitrary IDs
        // For MVP allowing authenticated users (assuming internal trust via token or
        // usage pattern)
        return new ResponseEntity<>(notificationService.sendNotification(request), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications() {
        return ResponseEntity.ok(notificationService.getMyNotifications());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }
}
