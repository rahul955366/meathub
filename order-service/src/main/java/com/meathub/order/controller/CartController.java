package com.meathub.order.controller;

import com.meathub.order.dto.AddToCartRequest;
import com.meathub.order.dto.CartResponse;
import com.meathub.order.dto.UpdateCartItemRequest;
import com.meathub.order.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(@Valid @RequestBody AddToCartRequest request) {
        CartResponse response = cartService.addToCart(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        CartResponse response = cartService.getCart();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/item/{id}")
    public ResponseEntity<CartResponse> updateItemQuantity(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartResponse response = cartService.updateItemQuantity(id, request.getQuantity());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/item/{id}")
    public ResponseEntity<Void> removeItem(@PathVariable Long id) {
        cartService.removeItem(id);
        return ResponseEntity.noContent().build();
    }
}
