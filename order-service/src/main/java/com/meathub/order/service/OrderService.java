package com.meathub.order.service;

import com.meathub.order.dto.*;
import com.meathub.order.entity.Cart;
import com.meathub.order.entity.CartItem;
import com.meathub.order.entity.Order;
import com.meathub.order.entity.OrderItem;
import com.meathub.order.exception.EmptyCartException;
import com.meathub.order.exception.InvalidOrderStatusException;
import com.meathub.order.exception.OrderNotFoundException;
import com.meathub.order.exception.UnauthorizedException;
import com.meathub.order.repository.CartRepository;
import com.meathub.order.repository.OrderRepository;
import com.meathub.order.security.UserPrincipal;
import com.meathub.order.websocket.OrderWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderWebSocketHandler orderWebSocketHandler;

    @Transactional
    @CacheEvict(value = {"orders", "cart"}, allEntries = true)
    public OrderResponse placeOrder(PlaceOrderRequest request) {
        Long userId = getCurrentUserId();

        // Get cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new EmptyCartException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new EmptyCartException("Cart is empty. Add items before placing order.");
        }

        // Validate all items belong to the same butcher
        List<CartItem> allItems = cart.getItems();
        if (allItems.isEmpty()) {
            throw new EmptyCartException("Cart is empty. Add items before placing order.");
        }

        // Check if cart has items from multiple butchers
        long uniqueButcherCount = allItems.stream()
                .map(CartItem::getButcherId)
                .distinct()
                .count();

        if (uniqueButcherCount > 1) {
            throw new IllegalArgumentException(
                    "Cart contains items from multiple butchers. " +
                    "Please order from one butcher at a time. " +
                    "Remove items from other butchers or create separate orders.");
        }

        // Filter items by requested butcher
        List<CartItem> butcherItems = allItems.stream()
                .filter(item -> item.getButcherId().equals(request.getButcherId()))
                .collect(Collectors.toList());

        if (butcherItems.isEmpty()) {
            throw new EmptyCartException("No items from this butcher in cart");
        }

        // Validate all items actually belong to the requested butcher
        boolean allItemsMatchButcher = butcherItems.stream()
                .allMatch(item -> item.getButcherId().equals(request.getButcherId()));

        if (!allItemsMatchButcher) {
            throw new IllegalArgumentException("Cart contains items from different butchers");
        }

        // Create order
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUserId(userId);
        order.setButcherId(request.getButcherId());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryPhone(request.getDeliveryPhone());
        order.setNotes(request.getNotes());
        order.setStatus(Order.OrderStatus.PENDING);

        // Add order items
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : butcherItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMeatItemId(cartItem.getMeatItemId());
            orderItem.setMeatItemName(cartItem.getMeatItemName());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPricePerUnit(cartItem.getPrice());
            orderItem.setSubtotal(cartItem.getPrice().multiply(cartItem.getQuantity()));
            orderItem.setUnit(cartItem.getUnit());

            order.getItems().add(orderItem);
            total = total.add(orderItem.getSubtotal());
        }
        order.setTotalAmount(total);

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Remove ordered items from cart
        cart.getItems().removeAll(butcherItems);
        cart.calculateTotal();
        cartRepository.save(cart);

        return mapToResponse(savedOrder);
    }

    public List<OrderResponse> getMyOrders() {
        Long userId = getCurrentUserId();
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = "orders", allEntries = true)
    public OrderResponse cancelOrder(Long orderId, CancelOrderRequest request) {
        Long userId = getCurrentUserId();

        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found or unauthorized"));

        if (!order.canCancel()) {
            throw new InvalidOrderStatusException(
                    "Cannot cancel order in " + order.getStatus() + " status. " +
                            "Cancellation is only allowed before cutting starts.");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setCancellationReason(request.getReason());
        order.setCancelledAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    public List<OrderResponse> getButcherOrders() {
        Long butcherId = getCurrentButcherId();
        List<Order> orders = orderRepository.findByButcherIdOrderByCreatedAtDesc(butcherId);
        return orders.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Long butcherId = getCurrentButcherId();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));

        // Verify butcher owns this order
        if (!order.getButcherId().equals(butcherId)) {
            throw new UnauthorizedException("You are not authorized to update this order");
        }

        // Validate status transition
        if (!order.canUpdateStatus(request.getStatus())) {
            throw new InvalidOrderStatusException(
                    "Cannot change status from " + order.getStatus() + " to " + request.getStatus());
        }

        order.setStatus(request.getStatus());

        // Set timestamps
        if (request.getStatus() == Order.OrderStatus.CONFIRMED) {
            order.setConfirmedAt(LocalDateTime.now());
        } else if (request.getStatus() == Order.OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        }

        // Broadcast WebSocket update
        try {
            orderWebSocketHandler.broadcastOrderUpdate(orderId);
        } catch (Exception e) {
            log.warn("Failed to broadcast order update via WebSocket", e);
        }

        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        return orders.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "ORD" + timestamp;
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userPrincipal.getUserId();
    }

    // Helper method for cache key generation
    public static Long getCurrentUserIdStatic() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
            return userPrincipal.getUserId();
        }
        return 0L;
    }

    private Long getCurrentButcherId() {
        // For now, using userId - in production would query butcher-service
        return getCurrentUserId();
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setUserId(order.getUserId());
        response.setButcherId(order.getButcherId());
        response.setButcherBusinessName(order.getButcherBusinessName());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setDeliveryPhone(order.getDeliveryPhone());
        response.setNotes(order.getNotes());
        response.setCancellationReason(order.getCancellationReason());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        response.setConfirmedAt(order.getConfirmedAt());
        response.setCancelledAt(order.getCancelledAt());
        response.setDeliveredAt(order.getDeliveredAt());

        response.setItems(order.getItems().stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList()));

        return response;
    }

    private OrderItemResponse mapItemToResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        response.setMeatItemId(item.getMeatItemId());
        response.setMeatItemName(item.getMeatItemName());
        response.setQuantity(item.getQuantity());
        response.setPricePerUnit(item.getPricePerUnit());
        response.setSubtotal(item.getSubtotal());
        response.setUnit(item.getUnit());
        return response;
    }
}
