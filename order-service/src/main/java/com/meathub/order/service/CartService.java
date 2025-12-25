package com.meathub.order.service;

import com.meathub.order.dto.AddToCartRequest;
import com.meathub.order.dto.CartItemResponse;
import com.meathub.order.dto.CartResponse;
import com.meathub.order.entity.Cart;
import com.meathub.order.entity.CartItem;
import com.meathub.order.exception.CartNotFoundException;
import com.meathub.order.repository.CartItemRepository;
import com.meathub.order.repository.CartRepository;
import com.meathub.order.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {
        Long userId = getCurrentUserId();

        // Get or create cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    return cartRepository.save(newCart);
                });

        // Validate: Prevent mixing items from different butchers
        if (!cart.getItems().isEmpty()) {
            Long existingButcherId = cart.getItems().get(0).getButcherId();
            if (!existingButcherId.equals(request.getButcherId())) {
                throw new IllegalArgumentException(
                        "Cannot add items from different butchers to the same cart. " +
                        "Your cart currently has items from butcher ID: " + existingButcherId + ". " +
                        "Please complete or clear your current order before adding items from another butcher.");
            }
        }

        // Check if item already exists
        boolean itemExists = false;
        for (CartItem item : cart.getItems()) {
            if (item.getMeatItemId().equals(request.getMeatItemId())) {
                item.setQuantity(item.getQuantity().add(request.getQuantity()));
                itemExists = true;
                break;
            }
        }

        // Add new item if not exists
        if (!itemExists) {
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setMeatItemId(request.getMeatItemId());
            cartItem.setButcherId(request.getButcherId());
            cartItem.setMeatItemName(request.getMeatItemName());
            cartItem.setQuantity(request.getQuantity());
            cartItem.setPrice(request.getPrice());
            cartItem.setUnit(request.getUnit());
            cart.getItems().add(cartItem);
        }

        // Recalculate total
        cart.calculateTotal();
        Cart savedCart = cartRepository.save(cart);

        return mapToResponse(savedCart);
    }

    public CartResponse getCart() {
        Long userId = getCurrentUserId();
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    // Return empty cart if not found
                    Cart emptyCart = new Cart();
                    emptyCart.setUserId(userId);
                    emptyCart.setTotalAmount(BigDecimal.ZERO);
                    return cartRepository.save(emptyCart);
                });
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse updateItemQuantity(Long itemId, BigDecimal quantity) {
        Long userId = getCurrentUserId();

        CartItem cartItem = cartItemRepository.findByIdAndCartUserId(itemId, userId)
                .orElseThrow(() -> new CartNotFoundException("Cart item not found"));

        Cart cart = cartItem.getCart();

        // If quantity is 0 or less, remove the item (like Amazon/Flipkart)
        if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
            cart.getItems().remove(cartItem);
            cartItemRepository.delete(cartItem);
        } else {
            // Update quantity directly (like Amazon/Flipkart) - supports decimals (0.5, 0.25, etc.)
            cartItem.setQuantity(quantity);
        }

        cart.calculateTotal();
        Cart savedCart = cartRepository.save(cart);

        return mapToResponse(savedCart);
    }

    @Transactional
    public void removeItem(Long itemId) {
        Long userId = getCurrentUserId();

        CartItem cartItem = cartItemRepository.findByIdAndCartUserId(itemId, userId)
                .orElseThrow(() -> new CartNotFoundException("Cart item not found"));

        Cart cart = cartItem.getCart();
        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        cart.calculateTotal();
        cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.getItems().clear();
            cart.setTotalAmount(BigDecimal.ZERO);
            cartRepository.save(cart);
        });
    }

    private Long getCurrentUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
                UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
                return userPrincipal.getUserId();
            }
        } catch (Exception e) {
            // If authentication fails, use default user ID for testing
        }
        // Return default user ID 1 for testing without authentication
        return 1L;
    }

    private CartResponse mapToResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUserId());
        response.setTotalAmount(cart.getTotalAmount());
        response.setCreatedAt(cart.getCreatedAt());
        response.setUpdatedAt(cart.getUpdatedAt());

        response.setItems(cart.getItems().stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList()));

        return response;
    }

    private CartItemResponse mapItemToResponse(CartItem item) {
        CartItemResponse response = new CartItemResponse();
        response.setId(item.getId());
        response.setMeatItemId(item.getMeatItemId());
        response.setButcherId(item.getButcherId());
        response.setMeatItemName(item.getMeatItemName());
        response.setQuantity(item.getQuantity());
        response.setPrice(item.getPrice());
        response.setUnit(item.getUnit());
        response.setSubtotal(item.getPrice().multiply(item.getQuantity()));
        return response;
    }
}
