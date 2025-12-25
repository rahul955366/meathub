package com.meatup.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 🎯 HIGH-IMPACT FEATURE #1: Order Experience Narration
 * 
 * Makes waiting feel shorter by narrating the order journey in real-time
 * with emotional, human language that reassures users.
 */
@Service
@Slf4j
public class OrderNarrationService {

    @Autowired
    private GenAIService genAIService;

    @Value("${ai.enabled:false}")
    private boolean aiEnabled;

    /**
     * Generate emotional, human-language narration for order status
     * This is what makes MeatHub feel 10x better than competitors
     */
    public String narrateOrderStatus(Object orderData, String authToken) {
        if (!aiEnabled) {
            return generateFallbackNarration(orderData);
        }

        try {
            // Extract order details
            Map<String, Object> order = parseOrderData(orderData);
            String status = (String) order.get("status");
            String orderNumber = (String) order.get("orderNumber");
            LocalDateTime createdAt = parseDateTime(order.get("createdAt"));
            LocalDateTime updatedAt = parseDateTime(order.get("updatedAt"));
            
            // Get order items for context
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) order.get("items");
            String itemsDescription = buildItemsDescription(items);

            // Calculate time elapsed
            Duration elapsed = Duration.between(createdAt != null ? createdAt : LocalDateTime.now(), 
                                               updatedAt != null ? updatedAt : LocalDateTime.now());

            // Build contextual prompt for GenAI
            String systemPrompt = buildNarrationSystemPrompt();
            String userPrompt = buildNarrationUserPrompt(status, orderNumber, itemsDescription, elapsed);

            // Generate narration using GenAI
            String narration = genAIService.generateNarration(systemPrompt, userPrompt);

            return narration;

        } catch (Exception e) {
            log.error("Error generating order narration", e);
            return generateFallbackNarration(orderData);
        }
    }

    /**
     * Build system prompt that makes AI conversational, reassuring, and emotionally intelligent
     */
    private String buildNarrationSystemPrompt() {
        return """
            You are MEATHUB's Order Narrator - a friendly, reassuring voice that makes waiting feel shorter.
            
            Your role:
            - Narrate order journey in real-time with emotional, human language
            - Reassure users during delays
            - Make technical statuses feel personal and warm
            - Use Indian English (e.g., "kg", "Rs", "PM")
            - Keep responses concise (1-2 sentences max)
            - Add relevant emojis sparingly (1-2 max)
            
            Tone Guidelines:
            - Be warm and friendly, like a friend updating you
            - Show empathy during delays
            - Celebrate progress ("Your chicken is being cut fresh right now 🐔")
            - Reassure about safety ("Rider stopped for a signal, but your order is safe and warm")
            - Build anticipation ("2 turns away — keep the pan ready 🍳")
            
            Examples:
            - PENDING: "Your order is confirmed! Our butcher is preparing your fresh meat 🥩"
            - CONFIRMED: "Great news! Your order is confirmed and will be ready soon"
            - CUTTING: "Your chicken is being cut fresh right now 🐔 Just a few more minutes!"
            - PACKED: "All packed and ready! Your order is being handed to our delivery partner"
            - OUT_FOR_DELIVERY: "Rider stopped for a signal, but your order is safe and warm. Almost there!"
            - DELIVERED: "Your order has arrived! Enjoy your fresh meat 🎉"
            
            Never be robotic or technical. Always be human and reassuring.
            """;
    }

    /**
     * Build user prompt with order context
     */
    private String buildNarrationUserPrompt(String status, String orderNumber, 
                                           String itemsDescription, Duration elapsed) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("Order Status: ").append(status).append("\n");
        prompt.append("Order Number: ").append(orderNumber).append("\n");
        prompt.append("Items: ").append(itemsDescription).append("\n");
        
        if (elapsed.toMinutes() > 0) {
            prompt.append("Time elapsed: ").append(elapsed.toMinutes()).append(" minutes\n");
        }
        
        prompt.append("\nGenerate a warm, reassuring narration for this order status.");
        
        return prompt.toString();
    }

    /**
     * Fallback narration when AI is disabled - still emotional but rule-based
     */
    private String generateFallbackNarration(Object orderData) {
        try {
            Map<String, Object> order = parseOrderData(orderData);
            String status = (String) order.get("status");
            String orderNumber = (String) order.get("orderNumber");
            
            return switch (status) {
                case "PENDING" -> "Your order #" + orderNumber + " is confirmed! Our butcher is preparing your fresh meat 🥩";
                case "CONFIRMED" -> "Great news! Your order is confirmed and will be ready soon";
                case "CUTTING" -> "Your meat is being cut fresh right now 🐔 Just a few more minutes!";
                case "PACKED" -> "All packed and ready! Your order is being handed to our delivery partner";
                case "OUT_FOR_DELIVERY" -> "Your order is on the way! Our rider is bringing it to you safely 🚚";
                case "DELIVERED" -> "Your order has arrived! Enjoy your fresh meat 🎉";
                case "CANCELLED" -> "Your order has been cancelled. We're sorry for any inconvenience.";
                default -> "Your order is being processed. We'll update you soon!";
            };
        } catch (Exception e) {
            return "Your order is being processed. We'll update you soon!";
        }
    }

    /**
     * Build human-readable description of order items
     */
    private String buildItemsDescription(List<Map<String, Object>> items) {
        if (items == null || items.isEmpty()) {
            return "your items";
        }

        StringBuilder desc = new StringBuilder();
        for (int i = 0; i < Math.min(items.size(), 3); i++) {
            Map<String, Object> item = items.get(i);
            String name = (String) item.getOrDefault("productName", "item");
            if (i > 0) desc.append(", ");
            desc.append(name);
        }
        
        if (items.size() > 3) {
            desc.append(" and ").append(items.size() - 3).append(" more");
        }
        
        return desc.toString();
    }

    /**
     * Parse order data from various formats
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> parseOrderData(Object orderData) {
        if (orderData instanceof Map) {
            return (Map<String, Object>) orderData;
        }
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(orderData);
            return mapper.readValue(json, Map.class);
        } catch (Exception e) {
            log.error("Error parsing order data", e);
            return new HashMap<>();
        }
    }

    /**
     * Parse datetime from various formats
     */
    private LocalDateTime parseDateTime(Object dateTime) {
        if (dateTime == null) return null;
        if (dateTime instanceof LocalDateTime) return (LocalDateTime) dateTime;
        if (dateTime instanceof String) {
            try {
                return LocalDateTime.parse((String) dateTime);
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Generate delay explanation when order is taking longer than expected
     */
    public String explainDelay(Object orderData, String reason) {
        if (!aiEnabled) {
            return "We're experiencing a slight delay. Your order is being prepared with extra care. Thank you for your patience! 🙏";
        }

        try {
            Map<String, Object> order = parseOrderData(orderData);
            String orderNumber = (String) order.get("orderNumber");
            
            String systemPrompt = """
                You are MEATHUB's Order Narrator explaining a delay.
                Be empathetic, honest, and reassuring.
                Keep it to 1-2 sentences.
                Use Indian English.
                """;
            
            String userPrompt = String.format(
                "Order #%s is delayed. Reason: %s\n\nExplain this delay warmly and reassure the customer.",
                orderNumber, reason
            );
            
            return genAIService.generateNarration(systemPrompt, userPrompt);
        } catch (Exception e) {
            return "We're experiencing a slight delay. Your order is being prepared with extra care. Thank you for your patience! 🙏";
        }
    }
}

