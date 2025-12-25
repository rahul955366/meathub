package com.meathub.auth.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private JwtService jwtService;
    private UserDetails testUserDetails;
    private String secretKey = "bXlTZWNyZXRLZXlGb3JKd3RUb2tlbkdlbmVyYXRpb25BbmRWYWxpZGF0aW9uMTIzNDU2Nzg5";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();

        // Set the secret key and expiration using reflection
        ReflectionTestUtils.setField(jwtService, "jwtSecret", secretKey);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L); // 24 hours

        testUserDetails = User.builder()
                .username("test@example.com")
                .password("password")
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_USER")))
                .build();
    }

    @Test
    void generateToken_Success() {
        // Act
        String token = jwtService.generateToken(testUserDetails);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.startsWith("eyJ")); // JWT tokens start with "eyJ"
    }

    @Test
    void extractUsername_Success() {
        // Arrange
        String token = jwtService.generateToken(testUserDetails);

        // Act
        String username = jwtService.extractUsername(token);

        // Assert
        assertEquals("test@example.com", username);
    }

    @Test
    void extractExpiration_Success() {
        // Arrange
        String token = jwtService.generateToken(testUserDetails);

        // Act
        Date expiration = jwtService.extractExpiration(token);

        // Assert
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date())); // Should be in the future
    }

    @Test
    void extractClaim_Success() {
        // Arrange
        String token = jwtService.generateToken(testUserDetails);

        // Act
        String subject = jwtService.extractClaim(token, Claims::getSubject);

        // Assert
        assertEquals("test@example.com", subject);
    }

    @Test
    void validateToken_ValidToken_ReturnsTrue() {
        // Arrange
        String token = jwtService.generateToken(testUserDetails);

        // Act
        boolean isValid = jwtService.validateToken(token, testUserDetails);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void validateToken_InvalidUsername_ReturnsFalse() {
        // Arrange
        String token = jwtService.generateToken(testUserDetails);
        UserDetails differentUser = User.builder()
                .username("different@example.com")
                .password("password")
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_USER")))
                .build();

        // Act
        boolean isValid = jwtService.validateToken(token, differentUser);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void validateToken_MalformedToken_ReturnsFalse() {
        // Arrange
        String malformedToken = "invalid.jwt.token";

        // Act
        boolean isValid = jwtService.validateToken(malformedToken, testUserDetails);

        // Assert
        assertFalse(isValid);
    }
}
