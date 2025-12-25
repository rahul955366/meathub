package com.meathub.order.service;

import com.meathub.order.dto.*;
import com.meathub.order.entity.Cart;
import com.meathub.order.entity.Order;
import com.meathub.order.entity.OrderItem;
import com.meathub.order.exception.EmptyCartException;
import com.meathub.order.exception.OrderNotFoundException;
import com.meathub.order.repository.CartRepository;
import com.meathub.order.repository.OrderRepository;
import com.meathub.order.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartService cartService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private OrderService orderService;

    private Long userId;
    private Long butcherId;
    private Cart cart;
    private Order order;

    @BeforeEach
    void setUp() {
        userId = 1L;
        butcherId = 1L;
        
        cart = new Cart();
        cart.setId(1L);
        cart.setUserId(userId);
        cart.setItems(new ArrayList<>());

        order = new Order();
        order.setId(1L);
        order.setOrderNumber("ORD123");
        order.setUserId(userId);
        order.setButcherId(butcherId);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotalAmount(BigDecimal.valueOf(500.0));
        order.setItems(new ArrayList<>());

        // Mock security context
        SecurityContextHolder.setContext(securityContext);
        UserPrincipal userPrincipal = new UserPrincipal();
        userPrincipal.setUserId(userId);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
    }

    @Test
    void testPlaceOrder_Success() {
        // Given
        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setButcherId(butcherId);
        request.setDeliveryAddress("123 Main St");
        request.setDeliveryPhone("1234567890");

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order savedOrder = invocation.getArgument(0);
            savedOrder.setId(1L);
            return savedOrder;
        });

        // When
        OrderResponse response = orderService.placeOrder(request);

        // Then
        assertNotNull(response);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void testPlaceOrder_EmptyCart() {
        // Given
        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setButcherId(butcherId);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));

        // When & Then
        assertThrows(EmptyCartException.class, () -> {
            orderService.placeOrder(request);
        });
    }

    @Test
    void testGetMyOrders() {
        // Given
        List<Order> orders = List.of(order);
        when(orderRepository.findByUserIdOrderByCreatedAtDesc(userId)).thenReturn(orders);

        // When
        List<OrderResponse> response = orderService.getMyOrders();

        // Then
        assertNotNull(response);
        assertEquals(1, response.size());
    }

    @Test
    void testCancelOrder_Success() {
        // Given
        CancelOrderRequest request = new CancelOrderRequest();
        request.setReason("Changed mind");

        when(orderRepository.findByIdAndUserId(1L, userId)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // When
        OrderResponse response = orderService.cancelOrder(1L, request);

        // Then
        assertNotNull(response);
        assertEquals(Order.OrderStatus.CANCELLED, order.getStatus());
    }

    @Test
    void testCancelOrder_NotFound() {
        // Given
        CancelOrderRequest request = new CancelOrderRequest();
        when(orderRepository.findByIdAndUserId(1L, userId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(OrderNotFoundException.class, () -> {
            orderService.cancelOrder(1L, request);
        });
    }
}

