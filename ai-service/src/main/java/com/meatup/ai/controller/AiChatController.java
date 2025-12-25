package com.meatup.ai.controller;

import com.meatup.ai.dto.ChatRequest;
import com.meatup.ai.dto.ChatResponse;
import com.meatup.ai.service.AiChatService;
import com.meatup.ai.service.OrderNarrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 🎯 AI Controller with High-Impact Features
 * 
 * Endpoints for:
 * - Chat with actionable AI assistant
 * - Order narration (emotional, human-language updates)
 * - Cooking guidance
 */
@RestController
@RequestMapping("/ai")
public class AiChatController {

    @Autowired
    private AiChatService aiChatService;

    @Autowired(required = false)
    private OrderNarrationService orderNarrationService;

    /**
     * Main chat endpoint - AI assistant that can DO THINGS
     * Supports context-specific AI (GYM, PET, etc.)
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        return ResponseEntity.ok(aiChatService.processChat(
            request.getMessage(), 
            request.getLanguage(),
            request.getContext(), // "GYM", "PET", "GENERAL"
            request.getUserContext() // Additional context like goals, plans
        ));
    }

    /**
     * 🥇 HIGH-IMPACT FEATURE #1: Order Experience Narration
     * 
     * Get emotional, human-language narration for order status
     * Makes waiting feel shorter, reduces support tickets
     */
    @PostMapping("/orders/narrate")
    public ResponseEntity<Map<String, String>> narrateOrder(
            @RequestBody Map<String, Object> orderData,
            @RequestHeader("Authorization") String authToken) {
        
        if (orderNarrationService == null) {
            return ResponseEntity.ok(Map.of("narration", 
                "Your order is being processed. We'll update you soon!"));
        }
        
        String token = authToken.replace("Bearer ", "");
        String narration = orderNarrationService.narrateOrderStatus(orderData, token);
        
        return ResponseEntity.ok(Map.of("narration", narration));
    }

    /**
     * Explain delay in order delivery
     */
    @PostMapping("/orders/explain-delay")
    public ResponseEntity<Map<String, String>> explainDelay(
            @RequestBody Map<String, Object> request) {
        
        if (orderNarrationService == null) {
            return ResponseEntity.ok(Map.of("explanation", 
                "We're experiencing a slight delay. Your order is being prepared with extra care. Thank you for your patience! 🙏"));
        }
        
        @SuppressWarnings("unchecked")
        Map<String, Object> orderData = (Map<String, Object>) request.get("order");
        String reason = (String) request.getOrDefault("reason", "processing delay");
        String explanation = orderNarrationService.explainDelay(orderData, reason);
        
        return ResponseEntity.ok(Map.of("explanation", explanation));
    }
}
