package com.meathub.order.service;

import com.meathub.order.dto.AddToCartRequest;
import com.meathub.order.dto.CartResponse;
import com.meathub.order.entity.Cart;
import com.meathub.order.entity.CartItem;
import com.meathub.order.repository.CartRepository;
import com.meathub.order.repository.CartItemRepository;
import com.meathub.order.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private CartService cartService;

    private Long userId;
    private Cart cart;

    @BeforeEach
    void setUp() {
        userId = 1L;
        cart = new Cart();
        cart.setId(1L);
        cart.setUserId(userId);
        cart.setItems(new ArrayList<>());
    }

    @Test
    void testAddToCart() {
        // Given
        AddToCartRequest request = new AddToCartRequest();
        request.setMeatItemId(1L);
        request.setButcherId(1L);
        request.setMeatItemName("Chicken Breast");
        request.setQuantity(BigDecimal.valueOf(1.0));
        request.setPrice(BigDecimal.valueOf(250.0));
        request.setUnit("KG");

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        CartResponse response = cartService.addToCart(request);

        // Then
        assertNotNull(response);
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }

    @Test
    void testGetCart() {
        // Given
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));

        // When
        CartResponse response = cartService.getCart();

        // Then
        assertNotNull(response);
        assertEquals(userId, response.getUserId());
    }
}

