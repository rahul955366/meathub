package com.meathub.order.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.meathub.order.dto.CancelOrderRequest;
import com.meathub.order.dto.OrderResponse;
import com.meathub.order.dto.PlaceOrderRequest;
import com.meathub.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management APIs")
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "Place a new order", description = "Creates a new order from the user's cart")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Order placed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request or empty cart"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/place")
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        OrderResponse response = orderService.placeOrder(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get user's orders", description = "Retrieves all orders for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Orders retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        List<OrderResponse> orders = orderService.getMyOrders();
        return ResponseEntity.ok(orders);
    }

    @Operation(summary = "Cancel an order", description = "Cancels an order that belongs to the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order cancelled successfully"),
            @ApiResponse(responseCode = "404", description = "Order not found"),
            @ApiResponse(responseCode = "400", description = "Order cannot be cancelled"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @Parameter(description = "Order ID to cancel") @PathVariable("orderId") Long orderId,
            @Valid @RequestBody CancelOrderRequest request) {
        OrderResponse response = orderService.cancelOrder(orderId, request);
        return ResponseEntity.ok(response);
    }
}
