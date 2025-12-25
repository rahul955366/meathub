package com.meathub.order.service;

import com.meathub.order.dto.PaymentRequest;
import com.meathub.order.dto.PaymentResponse;
import com.meathub.order.dto.VerifyPaymentRequest;
import com.meathub.order.dto.VerifyPaymentResponse;
import com.meathub.order.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private PaymentService paymentService;

    @BeforeEach
    void setUp() {
        // Set mock Razorpay config
        ReflectionTestUtils.setField(paymentService, "razorpayEnabled", false);
        ReflectionTestUtils.setField(paymentService, "razorpayKeyId", "rzp_test_mock");
        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", "mock_secret");
    }

    @Test
    void testCreatePayment() {
        // Given
        PaymentRequest request = new PaymentRequest();
        request.setAmount(100.0);
        request.setCurrency("INR");
        request.setDescription("Test payment");

        // When
        PaymentResponse response = paymentService.createPayment(request);

        // Then
        assertNotNull(response);
        assertNotNull(response.getPaymentId());
        assertEquals(100.0, response.getAmount());
        assertEquals("INR", response.getCurrency());
        assertEquals("created", response.getStatus());
    }

    @Test
    void testVerifyPayment() {
        // Given
        VerifyPaymentRequest request = new VerifyPaymentRequest();
        request.setRazorpayOrderId("order_test123");
        request.setRazorpayPaymentId("pay_test123");
        request.setRazorpaySignature("signature_test123");

        // When
        VerifyPaymentResponse response = paymentService.verifyPayment(request);

        // Then
        assertNotNull(response);
        assertTrue(response.getVerified()); // Mock mode always verifies
    }

    @Test
    void testGetPaymentStatus() {
        // Given
        String paymentId = "payment_test123";

        // When
        PaymentResponse response = paymentService.getPaymentStatus(paymentId);

        // Then
        assertNotNull(response);
        assertEquals(paymentId, response.getPaymentId());
    }
}

