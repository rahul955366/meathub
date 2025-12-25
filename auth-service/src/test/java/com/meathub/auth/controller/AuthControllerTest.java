package com.meathub.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meathub.auth.dto.AuthResponse;
import com.meathub.auth.dto.LoginRequest;
import com.meathub.auth.dto.RegisterRequest;
import com.meathub.auth.exception.UserAlreadyExistsException;
import com.meathub.auth.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void register_Success() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setFullName("Test User");
        request.setPhone("1234567890");
        request.setRole("USER");

        AuthResponse response = AuthResponse.builder()
                .token("jwt-token-123")
                .type("Bearer")
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .fullName("Test User")
                .roles(List.of("USER"))
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token-123"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.roles[0]").value("USER"));
    }

    @Test
    void register_UserAlreadyExists_ReturnsBadRequest() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existinguser");
        request.setEmail("existing@example.com");
        request.setPassword("password123");

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new UserAlreadyExistsException("Username already exists: existinguser"));

        // Act & Assert
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Username already exists: existinguser"));
    }

    @Test
    void register_InvalidRequest_ReturnsBadRequest() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        // Missing required fields

        // Act & Assert
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_Success() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password123");

        AuthResponse response = AuthResponse.builder()
                .token("jwt-token-123")
                .type("Bearer")
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .fullName("Test User")
                .roles(List.of("USER"))
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token-123"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void login_InvalidCredentials_ReturnsUnauthorized() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("wrongpassword");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Invalid username or password"));

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void login_InvalidRequest_ReturnsBadRequest() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        // Missing required fields

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
