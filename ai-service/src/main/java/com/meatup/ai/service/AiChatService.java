package com.meatup.ai.service;

import com.meatup.ai.dto.ChatResponse;
import com.meatup.ai.entity.ChatHistory;
import com.meatup.ai.repository.ChatHistoryRepository;
import com.meatup.ai.security.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * 🎯 Enhanced AI Chat Service with Actionable Capabilities
 * 
 * Integrates Order Narration, Action Execution, and Cooking Guidance
 * to make AI feel powerful, premium, and different.
 */
@Service
@Slf4j
public class AiChatService {

    @Autowired
    private IntentDetectionService intentDetectionService;

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @Autowired(required = false)
    private GenAIService genAIService; // Optional: Use Gen AI if available

    @Autowired(required = false)
    private ActionExecutorService actionExecutorService; // Action execution

    @Autowired(required = false)
    private OrderNarrationService orderNarrationService; // Order narration

    @Autowired(required = false)
    private CookingGuidanceService cookingGuidanceService; // Cooking help

    private final WebClient webClient;

    public AiChatService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8000").build();
    }

    public ChatResponse processChat(String message, String language) {
        return processChat(message, language, null, null);
    }

    public ChatResponse processChat(String message, String language, String context, Map<String, Object> userContext) {
        // Get authenticated user ID and token
        Long userId = getCurrentUserId();
        String token = getCurrentToken();

        // ALWAYS use Gen AI - no fallback to mock responses
        if (genAIService != null) {
            try {
                ChatResponse response = genAIService.processChatWithAI(message, language, userId, token, context,
                        userContext);

                // Enhance with actionable capabilities
                String intent = response.getDetectedIntent();

                // Execute actions for actionable intents
                if (actionExecutorService != null && shouldExecuteAction(intent)) {
                    Map<String, Object> entities = extractEntities(message);
                    ActionExecutorService.ActionResult actionResult = actionExecutorService.executeAction(intent,
                            message, token, entities);

                    if (actionResult.hasAction()) {
                        if (actionResult.isSuccess() && actionResult.getMessage() != null) {
                            // Override AI response with actionable result
                            response.setResponse(actionResult.getMessage());
                        } else if (!actionResult.isSuccess() && actionResult.getMessage() != null) {
                            // Use error message
                            response.setResponse(actionResult.getMessage());
                        }
                        response.setActionResult(actionResult.getData());
                    }
                }

                // Enhance order tracking with narration
                if ("TRACK_ORDER".equals(intent) && orderNarrationService != null
                        && response.getActionResult() != null) {
                    try {
                        String narration = orderNarrationService.narrateOrderStatus(response.getActionResult(), token);
                        if (narration != null && !narration.isEmpty()) {
                            response.setResponse(narration);
                        }
                    } catch (Exception e) {
                        // Keep original response if narration fails
                    }
                }

                // Enhance cooking help
                if ("COOKING_HELP".equals(intent) && cookingGuidanceService != null) {
                    Map<String, Object> entities = extractEntities(message);
                    String dish = (String) entities.getOrDefault("dish", extractDishFromMessage(message));
                    String meatType = (String) entities.getOrDefault("meat", extractMeatFromMessage(message));
                    String cut = (String) entities.getOrDefault("cut", extractCutFromMessage(message));

                    String cookingGuidance = cookingGuidanceService.provideCookingGuidance(dish, meatType, cut);
                    if (cookingGuidance != null && !cookingGuidance.isEmpty()) {
                        response.setResponse(cookingGuidance);
                    }
                }

                return response;
            } catch (Exception e) {
                log.error("Error calling GenAI, retrying with fallback to GenAI", e);
                // If GenAI fails, try again with a simpler prompt
                try {
                    ChatResponse retryResponse = genAIService.processChatWithAI(
                            message, language, userId, token, context, userContext);
                    return retryResponse;
                } catch (Exception retryException) {
                    log.error("GenAI retry also failed", retryException);
                    // Last resort: return friendly error message asking user to try again
                    String friendlyError = "I'm having a bit of trouble right now, but I'm here to help! Could you try asking your question again? I'm powered by AI and sometimes need a moment to process. 😊";
                    ChatResponse errorResponse = new ChatResponse();
                    errorResponse.setResponse(friendlyError);
                    errorResponse.setDetectedIntent("GENERAL_CHAT");
                    return errorResponse;
                }
            }
        }

        // If GenAI service is not available, return friendly message
        String friendlyMessage = "I'm currently setting up my AI capabilities. Please try again in a moment, or contact support if this persists. Thank you for your patience! 😊";
        ChatResponse fallbackResponse = new ChatResponse();
        fallbackResponse.setResponse(friendlyMessage);
        fallbackResponse.setDetectedIntent("GENERAL_CHAT");
        return fallbackResponse;
    }

    /**
     * Determine if action should be executed
     */
    private boolean shouldExecuteAction(String intent) {
        return "ORDER_MEAT".equals(intent) ||
                "CANCEL_ORDER".equals(intent) ||
                "TRACK_ORDER".equals(intent) ||
                "EXPLAIN_CHARGES".equals(intent) ||
                "SUGGEST_MEAT".equals(intent);
    }

    /**
     * Extract entities from message (simple regex-based, can be enhanced with NLP)
     */
    private Map<String, Object> extractEntities(String message) {
        Map<String, Object> entities = new HashMap<>();

        // Extract product/meat type
        String meat = extractMeatFromMessage(message);
        if (meat != null)
            entities.put("meat", meat);

        // Extract quantity
        String quantity = extractQuantityFromMessage(message);
        if (quantity != null)
            entities.put("quantity", quantity);

        // Extract cut
        String cut = extractCutFromMessage(message);
        if (cut != null)
            entities.put("cut", cut);

        // Extract dish
        String dish = extractDishFromMessage(message);
        if (dish != null)
            entities.put("dish", dish);

        // Extract order number
        String orderNumber = extractOrderNumberFromMessage(message);
        if (orderNumber != null)
            entities.put("orderNumber", orderNumber);

        return entities;
    }

    // Entity extraction helpers
    private String extractMeatFromMessage(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("chicken"))
            return "chicken";
        if (lower.contains("mutton"))
            return "mutton";
        if (lower.contains("fish"))
            return "fish";
        if (lower.contains("prawn"))
            return "prawn";
        return null;
    }

    private String extractQuantityFromMessage(String message) {
        Pattern pattern = Pattern.compile("(\\d+\\.?\\d*)\\s*(kg|g|gram|kilo)|(half|quarter)\\s*(kg|kilo)?");
        java.util.regex.Matcher matcher = pattern.matcher(message.toLowerCase());
        if (matcher.find()) {
            return matcher.group();
        }
        return null;
    }

    private String extractCutFromMessage(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("curry cut"))
            return "curry cut";
        if (lower.contains("boneless"))
            return "boneless";
        if (lower.contains("with bone"))
            return "with bone";
        return null;
    }

    private String extractDishFromMessage(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("curry"))
            return "curry";
        if (lower.contains("biryani"))
            return "biryani";
        if (lower.contains("tikka"))
            return "tikka";
        if (lower.contains("kebab"))
            return "kebab";
        if (lower.contains("butter chicken"))
            return "butter chicken";
        return null;
    }

    private String extractOrderNumberFromMessage(String message) {
        Pattern pattern = Pattern.compile("(ORD|#)\\s*\\d+");
        java.util.regex.Matcher matcher = pattern.matcher(message.toUpperCase());
        if (matcher.find()) {
            return matcher.group().replaceAll("[^0-9]", "");
        }
        return null;
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || "anonymousUser".equals(auth.getPrincipal())) {
            return null; // Guest user
        }
        if (!(auth.getPrincipal() instanceof UserPrincipal)) {
            return null; // Invalid auth principal
        }
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userPrincipal.getUserId();
    }

    private String getCurrentToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return "";
        }
        Object credentials = auth.getCredentials();
        return credentials != null ? credentials.toString() : "";
    }
}
