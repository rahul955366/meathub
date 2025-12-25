package com.meathub.auth.service;

import com.meathub.auth.dto.AuthResponse;
import com.meathub.auth.dto.GoogleTokenRequest;
import com.meathub.auth.dto.GoogleUserInfo;
import com.meathub.auth.entity.User;
import com.meathub.auth.entity.Role;
import com.meathub.auth.repository.RoleRepository;
import com.meathub.auth.repository.UserRepository;
import com.meathub.auth.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GoogleOAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private WebClient.Builder webClientBuilder;

    private static final String GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    /**
     * Verify Google token and get user info
     */
    public GoogleUserInfo verifyGoogleToken(String accessToken) {
        try {
            return webClientBuilder.build()
                    .get()
                    .uri(GOOGLE_USERINFO_URL)
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .bodyToMono(GoogleUserInfo.class)
                    .block();
        } catch (Exception e) {
            throw new RuntimeException("Invalid Google token: " + e.getMessage());
        }
    }

    /**
     * Handle Google OAuth login/register
     */
    public AuthResponse authenticateWithGoogle(GoogleTokenRequest request) {
        // Verify token with Google
        GoogleUserInfo googleUser = verifyGoogleToken(request.getToken());

        if (googleUser == null || googleUser.getEmail() == null) {
            throw new RuntimeException("Failed to get user info from Google");
        }

        if (!Boolean.TRUE.equals(googleUser.getEmail_verified())) {
            throw new RuntimeException("Email not verified by Google");
        }

        // Check if user exists
        Optional<User> existingUser = userRepository.findByEmail(googleUser.getEmail());

        User user;
        if (existingUser.isPresent()) {
            // User exists - just login
            user = existingUser.get();
        } else {
            // Create new user
            // Get or create USER role
            Role userRole = roleRepository.findByName(Role.RoleType.USER)
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setName(Role.RoleType.USER);
                        return roleRepository.save(newRole);
                    });

            Set<Role> roles = new HashSet<>();
            roles.add(userRole);

            user = new User();
            user.setUsername(generateUsernameFromEmail(googleUser.getEmail()));
            user.setEmail(googleUser.getEmail());
            user.setFullName(googleUser.getName());
            user.setPassword(passwordEncoder.encode("GOOGLE_OAUTH_" + googleUser.getSub())); // Encoded placeholder
            user.setPhone(""); // Can be updated later
            user.setRoles(roles);
            user.setOauthProvider("GOOGLE");
            user.setOauthProviderId(googleUser.getSub());
            user.setEnabled(true);

            user = userRepository.save(user);
        }

        // Generate JWT token - use the same method as AuthService
        String jwtToken = jwtService.generateToken(
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getUsername())
                        .password(user.getPassword())
                        .authorities(user.getRoles().stream()
                                .map(r -> "ROLE_" + r.getName().name())
                                .toArray(String[]::new))
                        .build(),
                user.getId());

        return AuthResponse.builder()
                .token(jwtToken)
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

    /**
     * Generate username from email
     */
    private String generateUsernameFromEmail(String email) {
        String baseUsername = email.split("@")[0];
        String username = baseUsername;
        int counter = 1;

        // Ensure unique username
        while (userRepository.findByUsername(username).isPresent()) {
            username = baseUsername + counter++;
        }

        return username;
    }
}
