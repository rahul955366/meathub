package com.meathub.user.service;

import com.meathub.user.entity.Address;
import com.meathub.user.entity.User;
import com.meathub.user.exception.AddressNotFoundException;
import com.meathub.user.exception.UserNotFoundException;
import com.meathub.user.repository.AddressRepository;
import com.meathub.user.repository.UserRepository;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private Address testAddress;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setPhone("1234567890");
        testUser.setAddresses(new ArrayList<>());

        testAddress = new Address();
        testAddress.setId(1L);
        testAddress.setUser(testUser);
        testAddress.setStreet("123 Main St");
        testAddress.setCity("New York");
        testAddress.setState("NY");
        testAddress.setZipCode("10001");
        testAddress.setCountry("USA");
        testAddress.setIsDefault(true);
    }

    @Test
    void getUserProfile_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.getUserProfile(1L);

        // Assert
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());
    }

    @Test
    void getUserProfile_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () ->
            userService.getUserProfile(1L));
    }

    @Test
    void updateUserProfile_Success() {
        // Arrange
        User updatedUser = new User();
        updatedUser.setFirstName("Jane");
        updatedUser.setLastName("Smith");
        updatedUser.setPhone("0987654321");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.updateUserProfile(1L, updatedUser);

        // Assert
        assertNotNull(result);
        verify(userRepository).save(testUser);
    }

    @Test
    void addAddress_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(addressRepository.save(any(Address.class))).thenReturn(testAddress);

        // Act
        Address result = userService.addAddress(1L, testAddress);

        // Assert
        assertNotNull(result);
        assertEquals("123 Main St", result.getStreet());
        assertEquals("New York", result.getCity());
        verify(addressRepository).save(testAddress);
    }

    @Test
    void getUserAddresses_Success() {
        // Arrange
        List<Address> addresses = List.of(testAddress);
        when(addressRepository.findByUserId(1L)).thenReturn(addresses);

        // Act
        List<Address> result = userService.getUserAddresses(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testAddress, result.get(0));
    }

    @Test
    void updateAddress_Success() {
        // Arrange
        Address updatedAddress = new Address();
        updatedAddress.setStreet("456 Oak St");
        updatedAddress.setCity("Los Angeles");

        when(addressRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testAddress));
        when(addressRepository.save(any(Address.class))).thenReturn(testAddress);

        // Act
        Address result = userService.updateAddress(1L, 1L, updatedAddress);

        // Assert
        assertNotNull(result);
        verify(addressRepository).save(testAddress);
    }

    @Test
    void updateAddress_AddressNotFound_ThrowsException() {
        // Arrange
        Address updatedAddress = new Address();
        when(addressRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(AddressNotFoundException.class, () ->
            userService.updateAddress(1L, 1L, updatedAddress));
    }

    @Test
    void deleteAddress_Success() {
        // Arrange
        when(addressRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testAddress));

        // Act
        userService.deleteAddress(1L, 1L);

        // Assert
        verify(addressRepository).delete(testAddress);
    }

    @Test
    void deleteAddress_AddressNotFound_ThrowsException() {
        // Arrange
        when(addressRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(AddressNotFoundException.class, () ->
            userService.deleteAddress(1L, 1L));
    }

    @Test
    void setDefaultAddress_Success() {
        // Arrange
        Address oldDefaultAddress = new Address();
        oldDefaultAddress.setId(2L);
        oldDefaultAddress.setIsDefault(true);

        List<Address> addresses = List.of(testAddress, oldDefaultAddress);

        when(addressRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testAddress));
        when(addressRepository.findByUserId(1L)).thenReturn(addresses);
        when(addressRepository.save(any(Address.class))).thenReturn(testAddress);

        // Act
        userService.setDefaultAddress(1L, 1L);

        // Assert
        verify(addressRepository, times(2)).save(any(Address.class)); // One for new default, one for old default
    }

    @Test
    void setDefaultAddress_AddressNotFound_ThrowsException() {
        // Arrange
        when(addressRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(AddressNotFoundException.class, () ->
            userService.setDefaultAddress(1L, 1L));
    }
}
