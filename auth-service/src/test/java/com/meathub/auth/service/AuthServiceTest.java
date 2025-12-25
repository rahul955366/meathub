package com.meathub.auth.service;

import com.meathub.auth.dto.AuthResponse;
import com.meathub.auth.dto.LoginRequest;
import com.meathub.auth.dto.RegisterRequest;
import com.meathub.auth.entity.Role;
import com.meathub.auth.entity.User;
import com.meathub.auth.exception.UserAlreadyExistsException;
import com.meathub.auth.repository.RoleRepository;
import com.meathub.auth.repository.UserRepository;
import com.meathub.auth.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private Role userRole;

    @BeforeEach
    void setUp() {
        userRole = new Role();
        userRole.setId(1L);
        userRole.setName(Role.RoleType.USER);

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
        testUser.setPhone("1234567890");
        testUser.setPassword("encodedPassword");
        testUser.setRoles(Set.of(userRole));
        testUser.setEnabled(true);
    }

    @Test
    void register_Success() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setFullName("Test User");
        request.setPhone("1234567890");
        request.setRole("USER");

        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(roleRepository.findByName(Role.RoleType.USER)).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(any(UserDetails.class), any(Long.class))).thenReturn("jwt-token");

        // Act
        AuthResponse result = authService.register(request);

        // Assert
        assertNotNull(result);
        assertEquals("jwt-token", result.getToken());
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("password123");
    }

    @Test
    void register_UsernameAlreadyExists_ThrowsException() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existinguser");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () ->
            authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists_ThrowsException() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("existing@example.com");
        request.setPassword("password123");

        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () ->
            authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password123");

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username("testuser")
                .password("encodedPassword")
                .authorities("ROLE_USER")
                .build();

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(jwtService.generateToken(userDetails, 1L)).thenReturn("jwt-token");

        // Act
        AuthResponse result = authService.login(request);

        // Assert
        assertNotNull(result);
        assertEquals("jwt-token", result.getToken());
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
    }
}
