package com.meathub.order.config;

import com.meathub.order.websocket.OrderWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final OrderWebSocketHandler orderWebSocketHandler;

    public WebSocketConfig(OrderWebSocketHandler orderWebSocketHandler) {
        this.orderWebSocketHandler = orderWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(orderWebSocketHandler, "/ws/orders/{orderId}")
                .setAllowedOrigins("*") // In production, restrict to specific origins
                .withSockJS(); // Fallback for browsers that don't support WebSocket
    }
}

