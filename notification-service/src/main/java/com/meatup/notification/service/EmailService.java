package com.meatup.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Email Service
 * For production, integrate with:
 * - AWS SES
 * - SendGrid
 * - Mailgun
 * - SMTP server
 */
@Service
@Slf4j
public class EmailService {

    @Value("${email.enabled:false}")
    private boolean emailEnabled;

    @Value("${email.provider:mock}")
    private String emailProvider; // mock, ses, sendgrid, smtp

    public void sendOrderConfirmation(String to, String orderNumber, Double amount) {
        if (!emailEnabled) {
            log.info("Email disabled. Would send order confirmation to {} for order {}", to, orderNumber);
            return;
        }

        String subject = "Order Confirmation - " + orderNumber;
        String body = String.format(
            "Dear Customer,\n\n" +
            "Your order #%s has been confirmed.\n" +
            "Total Amount: ₹%.2f\n\n" +
            "Thank you for shopping with MEATHUB!\n\n" +
            "Best regards,\n" +
            "MEATHUB Team",
            orderNumber, amount
        );

        sendEmail(to, subject, body);
    }

    public void sendOrderStatusUpdate(String to, String orderNumber, String status) {
        if (!emailEnabled) {
            log.info("Email disabled. Would send status update to {} for order {}", to, orderNumber);
            return;
        }

        String subject = "Order Status Update - " + orderNumber;
        String body = String.format(
            "Dear Customer,\n\n" +
            "Your order #%s status has been updated to: %s\n\n" +
            "Thank you for shopping with MEATHUB!\n\n" +
            "Best regards,\n" +
            "MEATHUB Team",
            orderNumber, status
        );

        sendEmail(to, subject, body);
    }

    public void sendSubscriptionConfirmation(String to, String subscriptionId, String plan) {
        if (!emailEnabled) {
            log.info("Email disabled. Would send subscription confirmation to {}", to);
            return;
        }

        String subject = "Subscription Confirmed - " + plan;
        String body = String.format(
            "Dear Customer,\n\n" +
            "Your subscription #%s for %s plan has been confirmed.\n\n" +
            "Thank you for subscribing to MEATHUB!\n\n" +
            "Best regards,\n" +
            "MEATHUB Team",
            subscriptionId, plan
        );

        sendEmail(to, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        switch (emailProvider.toLowerCase()) {
            case "ses":
                sendViaSES(to, subject, body);
                break;
            case "sendgrid":
                sendViaSendGrid(to, subject, body);
                break;
            case "smtp":
                sendViaSMTP(to, subject, body);
                break;
            default:
                log.info("Mock email sent to: {}, Subject: {}, Body: {}", to, subject, body);
        }
    }

    private void sendViaSES(String to, String subject, String body) {
        // TODO: Implement AWS SES integration
        log.info("Sending email via AWS SES to: {}", to);
    }

    private void sendViaSendGrid(String to, String subject, String body) {
        // TODO: Implement SendGrid integration
        log.info("Sending email via SendGrid to: {}", to);
    }

    private void sendViaSMTP(String to, String subject, String body) {
        // TODO: Implement SMTP integration
        log.info("Sending email via SMTP to: {}", to);
    }
}

