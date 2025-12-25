package com.meathub.auth.security;

import com.meathub.auth.entity.Role;
import com.meathub.auth.entity.User;
import com.meathub.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

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
        testUser.setPassword("encodedPassword");
        testUser.setFullName("Test User");
        testUser.setPhone("1234567890");
        testUser.setRoles(Set.of(userRole));
        testUser.setEnabled(true);
    }

    @Test
    void loadUserByUsername_UserFound_Success() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");

        // Assert
        assertNotNull(userDetails);
        assertEquals("testuser", userDetails.getUsername());
        assertEquals("encodedPassword", userDetails.getPassword());
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.isCredentialsNonExpired());
        assertEquals(1, userDetails.getAuthorities().size());
        assertEquals("ROLE_USER", userDetails.getAuthorities().iterator().next().getAuthority());
    }

    @Test
    void loadUserByUsername_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class, () ->
            userDetailsService.loadUserByUsername("nonexistent"));

        assertEquals("User not found: nonexistent", exception.getMessage());
    }

    @Test
    void loadUserByUsername_DisabledUser_Success() {
        // Arrange
        testUser.setEnabled(false);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");

        // Assert
        assertNotNull(userDetails);
        assertFalse(userDetails.isEnabled());
    }

    @Test
    void loadUserByUsername_AdminRole_Success() {
        // Arrange
        userRole.setName(Role.RoleType.ADMIN);
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername("admin");

        // Assert
        assertNotNull(userDetails);
        assertEquals("ROLE_ADMIN", userDetails.getAuthorities().iterator().next().getAuthority());
    }

    @Test
    void loadUserByUsername_ButcherRole_Success() {
        // Arrange
        userRole.setName(Role.RoleType.BUTCHER);
        when(userRepository.findByUsername("butcher")).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername("butcher");

        // Assert
        assertNotNull(userDetails);
        assertEquals("ROLE_BUTCHER", userDetails.getAuthorities().iterator().next().getAuthority());
    }
}
