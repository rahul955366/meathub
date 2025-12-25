package com.meathub.butcher.service;

import com.meathub.butcher.dto.ButcherOnboardRequest;
import com.meathub.butcher.entity.Butcher;
import com.meathub.butcher.exception.ButcherAlreadyExistsException;
import com.meathub.butcher.exception.ButcherNotFoundException;
import com.meathub.butcher.repository.ButcherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ButcherServiceTest {

    @Mock
    private ButcherRepository butcherRepository;

    @InjectMocks
    private ButcherService butcherService;

    private Butcher testButcher;
    private ButcherOnboardRequest onboardRequest;

    @BeforeEach
    void setUp() {
        testButcher = new Butcher();
        testButcher.setId(1L);
        testButcher.setUserId(1L);
        testButcher.setBusinessName("Test Butcher Shop");
        testButcher.setOwnerName("John Doe");
        testButcher.setEmail("butcher@example.com");
        testButcher.setPhone("1234567890");
        testButcher.setAddress("123 Main St");
        testButcher.setCity("New York");
        testButcher.setState("NY");
        testButcher.setZipCode("10001");
        testButcher.setLatitude(40.7128);
        testButcher.setLongitude(-74.0060);
        testButcher.setIsApproved(false);
        testButcher.setMeatItems(new ArrayList<>());

        onboardRequest = new ButcherOnboardRequest();
        onboardRequest.setBusinessName("Test Butcher Shop");
        onboardRequest.setOwnerName("John Doe");
        onboardRequest.setEmail("butcher@example.com");
        onboardRequest.setPhone("1234567890");
        onboardRequest.setAddress("123 Main St");
        onboardRequest.setCity("New York");
        onboardRequest.setState("NY");
        onboardRequest.setZipCode("10001");
        onboardRequest.setLatitude(40.7128);
        onboardRequest.setLongitude(-74.0060);
    }

    @Test
    void onboardButcher_Success() {
        // Arrange
        when(butcherRepository.existsByEmail(anyString())).thenReturn(false);
        when(butcherRepository.save(any(Butcher.class))).thenReturn(testButcher);

        // Act
        Butcher result = butcherService.onboardButcher(1L, onboardRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Test Butcher Shop", result.getBusinessName());
        assertEquals("butcher@example.com", result.getEmail());
        assertFalse(result.getIsApproved());
        verify(butcherRepository).save(any(Butcher.class));
    }

    @Test
    void onboardButcher_AlreadyExists_ThrowsException() {
        // Arrange
        when(butcherRepository.existsByEmail("butcher@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(ButcherAlreadyExistsException.class, () ->
            butcherService.onboardButcher(1L, onboardRequest));
        verify(butcherRepository, never()).save(any(Butcher.class));
    }

    @Test
    void getButcherProfile_Success() {
        // Arrange
        when(butcherRepository.findByUserId(1L)).thenReturn(Optional.of(testButcher));

        // Act
        Butcher result = butcherService.getButcherProfile(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Test Butcher Shop", result.getBusinessName());
        assertEquals(1L, result.getId());
    }

    @Test
    void getButcherProfile_NotFound_ThrowsException() {
        // Arrange
        when(butcherRepository.findByUserId(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ButcherNotFoundException.class, () ->
            butcherService.getButcherProfile(1L));
    }

    @Test
    void getAllButchers_Success() {
        // Arrange
        List<Butcher> butchers = List.of(testButcher);
        when(butcherRepository.findAll()).thenReturn(butchers);

        // Act
        List<Butcher> result = butcherService.getAllButchers();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testButcher, result.get(0));
    }

    @Test
    void approveButcher_Success() {
        // Arrange
        when(butcherRepository.findById(1L)).thenReturn(Optional.of(testButcher));
        when(butcherRepository.save(any(Butcher.class))).thenReturn(testButcher);

        // Act
        Butcher result = butcherService.approveButcher(1L);

        // Assert
        assertNotNull(result);
        assertTrue(result.getIsApproved());
        verify(butcherRepository).save(testButcher);
    }

    @Test
    void approveButcher_NotFound_ThrowsException() {
        // Arrange
        when(butcherRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ButcherNotFoundException.class, () ->
            butcherService.approveButcher(1L));
    }

    @Test
    void rejectButcher_Success() {
        // Arrange
        when(butcherRepository.findById(1L)).thenReturn(Optional.of(testButcher));

        // Act
        butcherService.rejectButcher(1L);

        // Assert
        verify(butcherRepository).delete(testButcher);
    }

    @Test
    void rejectButcher_NotFound_ThrowsException() {
        // Arrange
        when(butcherRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ButcherNotFoundException.class, () ->
            butcherService.rejectButcher(1L));
    }

    @Test
    void getNearbyButchers_Success() {
        // Arrange
        List<Butcher> nearbyButchers = List.of(testButcher);
        when(butcherRepository.findNearbyButchers(40.7128, -74.0060, 10.0)).thenReturn(nearbyButchers);

        // Act
        List<Butcher> result = butcherService.getNearbyButchers(40.7128, -74.0060, 10.0);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testButcher, result.get(0));
    }

    @Test
    void updateLocation_Success() {
        // Arrange
        when(butcherRepository.findByUserId(1L)).thenReturn(Optional.of(testButcher));
        when(butcherRepository.save(any(Butcher.class))).thenReturn(testButcher);

        // Act
        Butcher result = butcherService.updateLocation(1L, 41.7128, -75.0060);

        // Assert
        assertNotNull(result);
        assertEquals(41.7128, result.getLatitude());
        assertEquals(-75.0060, result.getLongitude());
        verify(butcherRepository).save(testButcher);
    }

    @Test
    void updateLocation_ButcherNotFound_ThrowsException() {
        // Arrange
        when(butcherRepository.findByUserId(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ButcherNotFoundException.class, () ->
            butcherService.updateLocation(1L, 41.7128, -75.0060));
    }

    @Test
    void getApprovedButchers_Success() {
        // Arrange
        testButcher.setIsApproved(true);
        List<Butcher> approvedButchers = List.of(testButcher);
        when(butcherRepository.findByIsApproved(true)).thenReturn(approvedButchers);

        // Act
        List<Butcher> result = butcherService.getApprovedButchers();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getIsApproved());
    }
}
