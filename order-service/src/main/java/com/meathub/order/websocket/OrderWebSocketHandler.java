package com.meathub.order.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meathub.order.dto.OrderResponse;
import com.meathub.order.entity.Order;
import com.meathub.order.repository.OrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
@Slf4j
public class OrderWebSocketHandler extends TextWebSocketHandler {

    private final OrderRepository orderRepository;
    private final ObjectMapper objectMapper;
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<Long, String> orderSessions = new ConcurrentHashMap<>(); // orderId -> sessionId

    public OrderWebSocketHandler(OrderRepository orderRepository, ObjectMapper objectMapper) {
        this.orderRepository = orderRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String orderId = extractOrderId(session);
        if (orderId != null) {
            sessions.put(session.getId(), session);
            orderSessions.put(Long.parseLong(orderId), session.getId());
            log.info("WebSocket connection established for order: {}", orderId);
            
            // Send current order status immediately
            sendOrderUpdate(session, Long.parseLong(orderId));
        } else {
            log.warn("WebSocket connection established without order ID");
            session.close(CloseStatus.BAD_DATA);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming messages (e.g., ping/pong for keep-alive)
        log.debug("Received message: {}", message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String orderId = extractOrderId(session);
        sessions.remove(session.getId());
        if (orderId != null) {
            orderSessions.remove(Long.parseLong(orderId));
        }
        log.info("WebSocket connection closed for order: {}, status: {}", orderId, status);
    }

    /**
     * Send order update to connected clients
     */
    public void broadcastOrderUpdate(Long orderId) {
        String sessionId = orderSessions.get(orderId);
        if (sessionId != null) {
            WebSocketSession session = sessions.get(sessionId);
            if (session != null && session.isOpen()) {
                sendOrderUpdate(session, orderId);
            }
        }
    }

    private void sendOrderUpdate(WebSocketSession session, Long orderId) {
        try {
            orderRepository.findById(orderId).ifPresent(order -> {
                try {
                    OrderResponse orderResponse = mapToOrderResponse(order);
                    String json = objectMapper.writeValueAsString(orderResponse);
                    session.sendMessage(new TextMessage(json));
                } catch (IOException e) {
                    log.error("Error sending order update", e);
                }
            });
        } catch (Exception e) {
            log.error("Error fetching order for update", e);
        }
    }

    private String extractOrderId(WebSocketSession session) {
        String uri = session.getUri().toString();
        // Extract orderId from URI like /ws/orders/123
        String[] parts = uri.split("/");
        if (parts.length > 0) {
            String lastPart = parts[parts.length - 1];
            try {
                Long.parseLong(lastPart);
                return lastPart;
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private OrderResponse mapToOrderResponse(Order order) {
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
        
        // Map items
        if (order.getItems() != null) {
            response.setItems(order.getItems().stream()
                .map(item -> {
                    com.meathub.order.dto.OrderItemResponse itemResponse = new com.meathub.order.dto.OrderItemResponse();
                    itemResponse.setId(item.getId());
                    itemResponse.setMeatItemId(item.getMeatItemId());
                    itemResponse.setMeatItemName(item.getMeatItemName());
                    itemResponse.setQuantity(item.getQuantity());
                    itemResponse.setPricePerUnit(item.getPricePerUnit());
                    itemResponse.setSubtotal(item.getSubtotal());
                    itemResponse.setUnit(item.getUnit());
                    return itemResponse;
                })
                .collect(Collectors.toList()));
        } else {
            response.setItems(new ArrayList<>());
        }
        
        return response;
    }
}

