package com.meatup.notification.service;

import com.meatup.notification.dto.NotificationRequest;
import com.meatup.notification.dto.NotificationResponse;
import com.meatup.notification.entity.Notification;
import com.meatup.notification.repository.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private SmsService smsService;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    public void testSendNotification() {
        // Arrange
        NotificationRequest request = new NotificationRequest();
        request.setUserId(1L);
        request.setTitle("Test Notification");
        request.setMessage("Test Message");
        request.setType(Notification.NotificationType.ORDER_STATUS);

        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUserId(1L);
        notification.setTitle("Test Notification");

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        // Act
        NotificationResponse response = notificationService.sendNotification(request);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(emailService, times(1)).sendOrderStatusUpdate(anyString(), anyString(), anyString());
    }
}
