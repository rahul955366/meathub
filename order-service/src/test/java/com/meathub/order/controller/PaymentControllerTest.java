package com.meathub.order.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meathub.order.dto.PaymentRequest;
import com.meathub.order.dto.PaymentResponse;
import com.meathub.order.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PaymentService paymentService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "USER")
    void testCreatePayment() throws Exception {
        // Given
        PaymentRequest request = new PaymentRequest();
        request.setAmount(100.0);
        request.setCurrency("INR");

        PaymentResponse response = new PaymentResponse();
        response.setPaymentId("payment_123");
        response.setAmount(100.0);
        response.setStatus("created");

        when(paymentService.createPayment(any(PaymentRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/payments/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentId").value("payment_123"))
                .andExpect(jsonPath("$.amount").value(100.0));
    }
}

