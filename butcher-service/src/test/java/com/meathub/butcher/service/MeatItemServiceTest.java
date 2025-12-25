package com.meathub.butcher.service;

import com.meathub.butcher.dto.MeatItemRequest;
import com.meathub.butcher.entity.Butcher;
import com.meathub.butcher.entity.MeatItem;
import com.meathub.butcher.exception.ButcherNotFoundException;
import com.meathub.butcher.exception.MeatItemNotFoundException;
import com.meathub.butcher.repository.ButcherRepository;
import com.meathub.butcher.repository.MeatItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MeatItemServiceTest {

    @Mock
    private MeatItemRepository meatItemRepository;

    @Mock
    private ButcherRepository butcherRepository;

    @InjectMocks
    private MeatItemService meatItemService;

    private MeatItem testMeatItem;
    private Butcher testButcher;
    private MeatItemRequest meatItemRequest;

    @BeforeEach
    void setUp() {
        testButcher = new Butcher();
        testButcher.setId(1L);
        testButcher.setUserId(1L);
        testButcher.setBusinessName("Test Butcher");
        testButcher.setIsApproved(true);

        testMeatItem = new MeatItem();
        testMeatItem.setId(1L);
        testMeatItem.setButcher(testButcher);
        testMeatItem.setName("Chicken Breast");
        testMeatItem.setDescription("Fresh chicken breast");
        testMeatItem.setCategory("CHICKEN");
        testMeatItem.setPrice(BigDecimal.valueOf(250.00));
        testMeatItem.setWeight(500.0);
        testMeatItem.setUnit("grams");
        testMeatItem.setStockQuantity(100);
        testMeatItem.setAvailable(true);

        meatItemRequest = new MeatItemRequest();
        meatItemRequest.setName("Chicken Breast");
        meatItemRequest.setDescription("Fresh chicken breast");
        meatItemRequest.setCategory("CHICKEN");
        meatItemRequest.setPrice(BigDecimal.valueOf(250.00));
        meatItemRequest.setWeight(500.0);
        meatItemRequest.setUnit("grams");
        meatItemRequest.setStockQuantity(100);
    }

    @Test
    void createMeatItem_Success() {
        // Arrange
        when(butcherRepository.findByUserId(1L)).thenReturn(Optional.of(testButcher));
        when(meatItemRepository.save(any(MeatItem.class))).thenReturn(testMeatItem);

        // Act
        MeatItem result = meatItemService.createMeatItem(1L, meatItemRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Chicken Breast", result.getName());
        assertEquals("CHICKEN", result.getCategory());
        assertEquals(BigDecimal.valueOf(250.00), result.getPrice());
        assertEquals(testButcher, result.getButcher());
        verify(meatItemRepository).save(any(MeatItem.class));
    }

    @Test
    void createMeatItem_ButcherNotFound_ThrowsException() {
        // Arrange
        when(butcherRepository.findByUserId(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ButcherNotFoundException.class, () ->
            meatItemService.createMeatItem(1L, meatItemRequest));
        verify(meatItemRepository, never()).save(any(MeatItem.class));
    }

    @Test
    void getMeatItemsByButcher_Success() {
        // Arrange
        List<MeatItem> meatItems = List.of(testMeatItem);
        when(meatItemRepository.findByButcherId(1L)).thenReturn(meatItems);

        // Act
        List<MeatItem> result = meatItemService.getMeatItemsByButcher(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testMeatItem, result.get(0));
    }

    @Test
    void getMeatItemById_Success() {
        // Arrange
        when(meatItemRepository.findById(1L)).thenReturn(Optional.of(testMeatItem));

        // Act
        MeatItem result = meatItemService.getMeatItemById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Chicken Breast", result.getName());
        assertEquals(1L, result.getId());
    }

    @Test
    void getMeatItemById_NotFound_ThrowsException() {
        // Arrange
        when(meatItemRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(MeatItemNotFoundException.class, () ->
            meatItemService.getMeatItemById(1L));
    }

    @Test
    void updateMeatItem_Success() {
        // Arrange
        MeatItemRequest updateRequest = new MeatItemRequest();
        updateRequest.setName("Updated Chicken Breast");
        updateRequest.setPrice(BigDecimal.valueOf(300.00));
        updateRequest.setStockQuantity(50);

        when(meatItemRepository.findByIdAndButcherId(1L, 1L)).thenReturn(Optional.of(testMeatItem));
        when(meatItemRepository.save(any(MeatItem.class))).thenReturn(testMeatItem);

        // Act
        MeatItem result = meatItemService.updateMeatItem(1L, 1L, updateRequest);

        // Assert
        assertNotNull(result);
        verify(meatItemRepository).save(testMeatItem);
    }

    @Test
    void updateMeatItem_NotFound_ThrowsException() {
        // Arrange
        MeatItemRequest updateRequest = new MeatItemRequest();
        updateRequest.setName("Updated Chicken Breast");

        when(meatItemRepository.findByIdAndButcherId(1L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(MeatItemNotFoundException.class, () ->
            meatItemService.updateMeatItem(1L, 1L, updateRequest));
    }

    @Test
    void deleteMeatItem_Success() {
        // Arrange
        when(meatItemRepository.findByIdAndButcherId(1L, 1L)).thenReturn(Optional.of(testMeatItem));

        // Act
        meatItemService.deleteMeatItem(1L, 1L);

        // Assert
        verify(meatItemRepository).delete(testMeatItem);
    }

    @Test
    void deleteMeatItem_NotFound_ThrowsException() {
        // Arrange
        when(meatItemRepository.findByIdAndButcherId(1L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(MeatItemNotFoundException.class, () ->
            meatItemService.deleteMeatItem(1L, 1L));
    }

    @Test
    void getAvailableMeatItems_Success() {
        // Arrange
        List<MeatItem> availableItems = List.of(testMeatItem);
        when(meatItemRepository.findByAvailableAndButcherIsApproved(true, true)).thenReturn(availableItems);

        // Act
        List<MeatItem> result = meatItemService.getAvailableMeatItems();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).isAvailable());
    }

    @Test
    void getMeatItemsByCategory_Success() {
        // Arrange
        List<MeatItem> chickenItems = List.of(testMeatItem);
        when(meatItemRepository.findByCategoryAndAvailableAndButcherIsApproved("CHICKEN", true, true))
                .thenReturn(chickenItems);

        // Act
        List<MeatItem> result = meatItemService.getMeatItemsByCategory("CHICKEN");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("CHICKEN", result.get(0).getCategory());
    }

    @Test
    void searchMeatItems_Success() {
        // Arrange
        List<MeatItem> searchResults = List.of(testMeatItem);
        when(meatItemRepository.findByNameContainingIgnoreCaseAndAvailableAndButcherIsApproved("chicken", true, true))
                .thenReturn(searchResults);

        // Act
        List<MeatItem> result = meatItemService.searchMeatItems("chicken");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getName().toLowerCase().contains("chicken"));
    }

    @Test
    void updateStock_Success() {
        // Arrange
        when(meatItemRepository.findByIdAndButcherId(1L, 1L)).thenReturn(Optional.of(testMeatItem));
        when(meatItemRepository.save(any(MeatItem.class))).thenReturn(testMeatItem);

        // Act
        MeatItem result = meatItemService.updateStock(1L, 1L, 75);

        // Assert
        assertNotNull(result);
        assertEquals(75, testMeatItem.getStockQuantity());
        verify(meatItemRepository).save(testMeatItem);
    }

    @Test
    void updateStock_ItemNotFound_ThrowsException() {
        // Arrange
        when(meatItemRepository.findByIdAndButcherId(1L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(MeatItemNotFoundException.class, () ->
            meatItemService.updateStock(1L, 1L, 75));
    }
}
