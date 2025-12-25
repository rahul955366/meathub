package com.meathub.auth.service;

import com.meathub.auth.dto.AuthResponse;
import com.meathub.auth.dto.LoginRequest;
import com.meathub.auth.dto.RegisterRequest;
import com.meathub.auth.entity.Role;
import com.meathub.auth.entity.User;
import com.meathub.auth.exception.InvalidRoleException;
import com.meathub.auth.exception.UserAlreadyExistsException;
import com.meathub.auth.repository.RoleRepository;
import com.meathub.auth.repository.UserRepository;
import com.meathub.auth.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

        private final UserRepository userRepository;
        private final RoleRepository roleRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        @Transactional
        public AuthResponse register(RegisterRequest request) {
                log.info("Processing registration for username: {}", request.getUsername());

                // Check if username already exists
                if (userRepository.existsByUsername(request.getUsername())) {
                        throw new UserAlreadyExistsException("Username already exists: " + request.getUsername());
                }

                // Check if email already exists
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new UserAlreadyExistsException("Email already exists: " + request.getEmail());
                }

                // Validate and get role
                Role.RoleType roleType;
                try {
                        roleType = Role.RoleType.valueOf(request.getRole().toUpperCase());
                } catch (IllegalArgumentException e) {
                        throw new InvalidRoleException("Invalid role: " + request.getRole() +
                                        ". Allowed roles: USER, BUTCHER, ADMIN");
                }

                // Get or create role
                Role role = roleRepository.findByName(roleType)
                                .orElseGet(() -> {
                                        Role newRole = new Role();
                                        newRole.setName(roleType);
                                        return roleRepository.save(newRole);
                                });

                // Create user
                Set<Role> roles = new HashSet<>();
                roles.add(role);

                User user = User.builder()
                                .username(request.getUsername())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .fullName(request.getFullName())
                                .phone(request.getPhone())
                                .roles(roles)
                                .enabled(true)
                                .build();

                User savedUser = userRepository.save(user);
                log.info("User registered successfully: {}", savedUser.getUsername());

                // Generate JWT token
                UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                                .username(savedUser.getUsername())
                                .password(savedUser.getPassword())
                                .authorities(savedUser.getRoles().stream()
                                                .map(r -> "ROLE_" + r.getName().name())
                                                .toArray(String[]::new))
                                .build();

                String token = jwtService.generateToken(userDetails, savedUser.getId());

                return AuthResponse.builder()
                                .token(token)
                                .type("Bearer")
                                .id(savedUser.getId())
                                .username(savedUser.getUsername())
                                .email(savedUser.getEmail())
                                .fullName(savedUser.getFullName())
                                .roles(savedUser.getRoles().stream()
                                                .map(r -> r.getName().name())
                                                .collect(Collectors.toList()))
                                .build();
        }

        @Transactional(readOnly = true)
        public AuthResponse login(LoginRequest request) {
                log.info("Processing login for username: {}", request.getUsername());

                // Authenticate user
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getUsername(),
                                                request.getPassword()));

                UserDetails userDetails = (UserDetails) authentication.getPrincipal();

                // Get user from database
                User user = userRepository.findByUsername(request.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Generate JWT token
                String token = jwtService.generateToken(userDetails, user.getId());

                log.info("User logged in successfully: {}", user.getUsername());

                return AuthResponse.builder()
                                .token(token)
                                .type("Bearer")
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .roles(user.getRoles().stream()
                                                .map(r -> r.getName().name())
                                                .collect(Collectors.toList()))
                                .build();
        }
}
