package com.meathub.auth.controller;

import com.meathub.auth.dto.AuthResponse;
import com.meathub.auth.dto.GoogleTokenRequest;
import com.meathub.auth.dto.LoginRequest;
import com.meathub.auth.dto.RegisterRequest;
import com.meathub.auth.service.AuthService;
import com.meathub.auth.service.GoogleOAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final GoogleOAuthService googleOAuthService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration request received for username: {}", request.getUsername());
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for username: {}", request.getUsername());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@Valid @RequestBody GoogleTokenRequest request) {
        log.info("Google OAuth login request received");
        AuthResponse response = googleOAuthService.authenticateWithGoogle(request);
        return ResponseEntity.ok(response);
    }
}
