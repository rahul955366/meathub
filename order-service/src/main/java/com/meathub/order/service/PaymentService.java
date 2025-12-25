package com.meathub.order.service;

import com.meathub.order.dto.*;
import com.meathub.order.entity.Order;
import com.meathub.order.repository.OrderRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final OrderRepository orderRepository;

    @Value("${razorpay.key.id:rzp_test_YOUR_KEY_ID}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:YOUR_SECRET_KEY}")
    private String razorpayKeySecret;

    @Value("${razorpay.enabled:false}")
    private boolean razorpayEnabled;

    /**
     * Create a payment order
     * In production, this would call Razorpay API
     * For now, returns mock response structure
     */
    @Transactional
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = "paymentService", fallbackMethod = "fallbackCreatePayment")
    public PaymentResponse createPayment(PaymentRequest request) {
        log.info("Creating payment for amount: {} {}", request.getAmount(), request.getCurrency());

        // Generate payment ID
        String paymentId = UUID.randomUUID().toString();

        // If Razorpay is enabled, call actual API
        if (razorpayEnabled && !razorpayKeyId.contains("YOUR_KEY")) {
            return createRazorpayOrder(request, paymentId);
        }

        // Mock response for development
        PaymentResponse response = new PaymentResponse();
        response.setPaymentId(paymentId);
        response.setOrderId(request.getOrderId());
        response.setSubscriptionId(request.getSubscriptionId());
        response.setAmount(request.getAmount());
        response.setCurrency(request.getCurrency());
        response.setStatus("created");
        response.setRazorpayOrderId("order_mock_" + UUID.randomUUID().toString().substring(0, 14));
        response.setKeyId(razorpayKeyId);

        log.info("Payment created: {}", paymentId);
        return response;
    }

    /**
     * Fallback for createPayment
     */
    public PaymentResponse fallbackCreatePayment(PaymentRequest request, Throwable t) {
        log.error("Payment service fallback triggered due to: {}", t.getMessage());
        PaymentResponse response = new PaymentResponse();
        response.setOrderId(request.getOrderId());
        response.setStatus("failed_temporary");
        response.setMessage("Payment gateway is temporarily unavailable. Please try again.");
        return response;
    }

    /**
     * Verify payment signature from Razorpay
     */
    @Transactional
    public VerifyPaymentResponse verifyPayment(VerifyPaymentRequest request) {
        log.info("Verifying payment: {}", request.getRazorpayPaymentId());

        boolean verified = false;
        String message = "Payment verification failed";

        // If Razorpay is enabled, verify actual signature
        if (razorpayEnabled && !razorpayKeySecret.contains("YOUR_SECRET")) {
            verified = verifyRazorpaySignature(
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpaySignature());
        } else {
            // Mock verification for development
            verified = true;
            message = "Payment verified successfully (mock mode)";
        }

        VerifyPaymentResponse response = new VerifyPaymentResponse();
        response.setVerified(verified);
        response.setOrderId(request.getOrderId());
        response.setSubscriptionId(request.getSubscriptionId());
        response.setMessage(verified ? message : "Invalid payment signature");

        if (verified && request.getOrderId() != null) {
            // Update order status
            orderRepository.findById(request.getOrderId()).ifPresent(order -> {
                order.setStatus(Order.OrderStatus.CONFIRMED);
                orderRepository.save(order);
                log.info("Order {} confirmed after payment", request.getOrderId());
            });
        }

        return response;
    }

    /**
     * Get payment status
     */
    public PaymentResponse getPaymentStatus(String paymentId) {
        // In production, fetch from Razorpay API
        PaymentResponse response = new PaymentResponse();
        response.setPaymentId(paymentId);
        response.setStatus("captured"); // Mock
        return response;
    }

    /**
     * Refund payment
     */
    @Transactional
    public PaymentResponse refundPayment(String paymentId, Double amount) {
        log.info("Processing refund for payment: {}, amount: {}", paymentId, amount);

        PaymentResponse response = new PaymentResponse();
        response.setPaymentId(paymentId);
        response.setStatus("refunded");
        response.setAmount(amount);

        return response;
    }

    /**
     * Create Razorpay order (actual API call)
     */
    private PaymentResponse createRazorpayOrder(PaymentRequest request, String paymentId) {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) (request.getAmount() * 100)); // Convert to paise
            orderRequest.put("currency", request.getCurrency() != null ? request.getCurrency() : "INR");
            orderRequest.put("receipt", paymentId);

            // Add customer details if available
            if (request.getCustomerName() != null || request.getCustomerEmail() != null) {
                JSONObject notes = new JSONObject();
                if (request.getCustomerName() != null) {
                    notes.put("customer_name", request.getCustomerName());
                }
                if (request.getCustomerEmail() != null) {
                    notes.put("customer_email", request.getCustomerEmail());
                }
                if (request.getCustomerPhone() != null) {
                    notes.put("customer_phone", request.getCustomerPhone());
                }
                if (request.getOrderId() != null) {
                    notes.put("meathub_order_id", request.getOrderId());
                }
                if (request.getSubscriptionId() != null) {
                    notes.put("meathub_subscription_id", request.getSubscriptionId());
                }
                orderRequest.put("notes", notes);
            }

            Order razorpayOrder = razorpay.Orders.create(orderRequest);

            PaymentResponse response = new PaymentResponse();
            response.setPaymentId(paymentId);
            response.setOrderId(request.getOrderId());
            response.setSubscriptionId(request.getSubscriptionId());
            response.setAmount(request.getAmount());
            response.setCurrency(request.getCurrency() != null ? request.getCurrency() : "INR");
            response.setRazorpayOrderId(razorpayOrder.get("id").toString());
            response.setKeyId(razorpayKeyId);
            response.setStatus("created");
            response.setOrderId(request.getOrderId() != null ? request.getOrderId().toString() : null);
            response.setSubscriptionId(
                    request.getSubscriptionId() != null ? request.getSubscriptionId().toString() : null);

            log.info("Razorpay order created: {}", response.getRazorpayOrderId());
            return response;

        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order", e);
            throw new RuntimeException("Failed to create payment order: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error creating Razorpay order", e);
            throw new RuntimeException("Failed to create payment order", e);
        }
    }

    /**
     * Verify Razorpay signature
     */
    private boolean verifyRazorpaySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String calculatedSignature = Base64.getEncoder().encodeToString(hash);
            return calculatedSignature.equals(signature);
        } catch (Exception e) {
            log.error("Error verifying Razorpay signature", e);
            return false;
        }
    }
}
