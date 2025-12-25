package com.meatup.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * SMS Service
 * For production, integrate with:
 * - AWS SNS
 * - Twilio
 * - MSG91
 * - TextLocal
 */
@Service
@Slf4j
public class SmsService {

    @Value("${sms.enabled:false}")
    private boolean smsEnabled;

    @Value("${sms.provider:mock}")
    private String smsProvider; // mock, sns, twilio, msg91

    public void sendOrderConfirmation(String phoneNumber, String orderNumber) {
        if (!smsEnabled) {
            log.info("SMS disabled. Would send order confirmation to {} for order {}", phoneNumber, orderNumber);
            return;
        }

        String message = String.format(
            "MEATHUB: Your order #%s has been confirmed. Track your order at meathub.com/orders/%s",
            orderNumber, orderNumber
        );

        sendSms(phoneNumber, message);
    }

    public void sendOrderStatusUpdate(String phoneNumber, String orderNumber, String status) {
        if (!smsEnabled) {
            log.info("SMS disabled. Would send status update to {} for order {}", phoneNumber, orderNumber);
            return;
        }

        String message = String.format(
            "MEATHUB: Your order #%s status updated to %s. Track at meathub.com/orders/%s",
            orderNumber, status, orderNumber
        );

        sendSms(phoneNumber, message);
    }

    public void sendOtp(String phoneNumber, String otp) {
        if (!smsEnabled) {
            log.info("SMS disabled. Would send OTP {} to {}", otp, phoneNumber);
            return;
        }

        String message = String.format("MEATHUB: Your OTP is %s. Valid for 5 minutes.", otp);
        sendSms(phoneNumber, message);
    }

    private void sendSms(String phoneNumber, String message) {
        switch (smsProvider.toLowerCase()) {
            case "sns":
                sendViaSNS(phoneNumber, message);
                break;
            case "twilio":
                sendViaTwilio(phoneNumber, message);
                break;
            case "msg91":
                sendViaMSG91(phoneNumber, message);
                break;
            default:
                log.info("Mock SMS sent to: {}, Message: {}", phoneNumber, message);
        }
    }

    private void sendViaSNS(String phoneNumber, String message) {
        // TODO: Implement AWS SNS integration
        log.info("Sending SMS via AWS SNS to: {}", phoneNumber);
    }

    private void sendViaTwilio(String phoneNumber, String message) {
        // TODO: Implement Twilio integration
        log.info("Sending SMS via Twilio to: {}", phoneNumber);
    }

    private void sendViaMSG91(String phoneNumber, String message) {
        // TODO: Implement MSG91 integration
        log.info("Sending SMS via MSG91 to: {}", phoneNumber);
    }
}

