// MEATHUB - Generative AI Service (OpenAI/Gemini Integration)

package com.meatup.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meatup.ai.dto.ChatResponse;
import com.meatup.ai.entity.ChatHistory;
import com.meatup.ai.repository.ChatHistoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class GenAIService {

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @Autowired
    private IntentDetectionService intentDetectionService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ai.provider:openai}")
    private String aiProvider;

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String geminiModel;

    @Value("${gemini.temperature:0.7}")
    private double geminiTemperature;

    @Value("${gemini.max-tokens:1000}")
    private int geminiMaxTokens;

    @Value("${openai.model:gpt-3.5-turbo}")
    private String openaiModel;

    @Value("${ai.enabled:false}")
    private boolean aiEnabled;

    @Value("${ai.context-window:4000}")
    private int contextWindow;

    @Value("${gateway.url:http://localhost:8000}")
    private String gatewayUrl;

    private final WebClient webClient;

    public GenAIService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    /**
     * Process chat message with Generative AI
     */
    public ChatResponse processChatWithAI(String message, String language, Long userId, String authToken) {
        return processChatWithAI(message, language, userId, authToken, null, null);
    }

    /**
     * Process chat message with Generative AI (with context support)
     */
    public ChatResponse processChatWithAI(String message, String language, Long userId, String authToken,
            String context, Map<String, Object> userContext) {
        if (!aiEnabled) {
            return fallbackResponse(message);
        }

        try {
            // Get conversation history for context
            List<ChatHistory> history = chatHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId)
                    .stream()
                    .limit(10) // Last 10 messages for context
                    .collect(Collectors.toList());

            // Detect intent
            String intent = intentDetectionService.detectIntent(message);

            // Build context-aware prompt (with specialized context if provided)
            String contextValue = (context != null && !context.isEmpty()) ? context : "GENERAL";
            Map<String, Object> userContextValue = (userContext != null) ? userContext : new HashMap<>();
            String systemPrompt = buildSystemPrompt(intent, userId, contextValue, userContextValue);
            String userPrompt = buildUserPrompt(message, history, intent);

            // Call AI provider
            String aiResponse = callAIProvider(systemPrompt, userPrompt);

            // Execute actions if needed
            Object actionResult = executeAction(intent, message, authToken);

            // Save to history
            saveChatHistory(userId, message, aiResponse);

            ChatResponse response = new ChatResponse();
            response.setResponse(aiResponse); // ChatResponse uses 'response' field
            response.setDetectedIntent(intent);
            response.setActionResult(actionResult);

            return response;

        } catch (Exception e) {
            log.error("Error processing AI chat", e);
            return fallbackResponse(message);
        }
    }

    /**
     * Build system prompt based on intent and context
     */
    private String buildSystemPrompt(String intent, Long userId, String context, Map<String, Object> userContext) {
        StringBuilder prompt = new StringBuilder();

        // Context-specific prompts
        if ("GYM".equalsIgnoreCase(context)) {
            prompt.append(
                    "You are MEATHUB Gym AI Coach - a friendly, encouraging, and highly knowledgeable fitness and nutrition expert.\n\n");
            prompt.append("YOUR PERSONALITY:\n");
            prompt.append("- Be warm, friendly, and conversational (like talking to a supportive friend)\n");
            prompt.append("- Be encouraging and motivational (like a personal trainer who cares)\n");
            prompt.append("- Show genuine interest in helping users achieve their fitness goals\n");
            prompt.append("- Use a natural, conversational tone - not robotic or formal\n");
            prompt.append("- Be enthusiastic about fitness and nutrition\n\n");

            prompt.append("YOUR EXPERTISE:\n");
            prompt.append(
                    "- Bulking strategies: Calorie surplus, macro ratios (protein 1.6-2.2g per kg bodyweight), meal timing, progressive overload\n");
            prompt.append(
                    "- Cutting strategies: Calorie deficit (500-750 cal), maintaining protein intake, fat loss while preserving muscle\n");
            prompt.append(
                    "- Diet planning: Protein distribution throughout the day, carb cycling, meal prep strategies\n");
            prompt.append(
                    "- Training advice: Workout splits (Push/Pull/Legs, Upper/Lower), recovery protocols, progressive overload\n");
            prompt.append(
                    "- Nutrition timing: Pre-workout (30-60 min before), post-workout (within 30 min), protein distribution\n");
            prompt.append("- Supplement guidance: When needed, what to avoid, natural alternatives\n\n");

            if (userContext != null) {
                String goal = (String) userContext.getOrDefault("goal", "Not specified");
                String dailyProtein = userContext.getOrDefault("dailyProtein", "Not set") + "g";
                String deliveryTime = (String) userContext.getOrDefault("deliveryTime", "Not set");

                prompt.append("USER CONTEXT:\n");
                prompt.append("- Fitness Goal: ").append(goal).append("\n");
                prompt.append("- Daily Protein Subscription: ").append(dailyProtein).append("\n");
                prompt.append("- Delivery Time: ").append(deliveryTime).append("\n\n");
            }

            prompt.append("RESPONSE STYLE:\n");
            prompt.append("- Be encouraging and motivational (like a personal trainer)\n");
            prompt.append("- Provide specific, actionable advice with numbers (grams, calories, sets, reps)\n");
            prompt.append("- Reference their protein subscription and suggest meal timing\n");
            prompt.append("- Use fitness terminology correctly (bulking, cutting, macros, progressive overload)\n");
            prompt.append("- Suggest meal prep strategies based on their delivery schedule\n");
            prompt.append("- Be concise but informative (gymmers value efficiency)\n");
            prompt.append("- Use emojis sparingly (💪 🏋️ 🥩) - maximum 1-2 per response\n");
            prompt.append("- Always sound friendly and approachable - like you're genuinely excited to help\n\n");

        } else if ("PET".equalsIgnoreCase(context)) {
            prompt.append("You are MEATHUB Pet AI Assistant - specialized in pet nutrition and care.\n\n");
            prompt.append("YOUR EXPERTISE:\n");
            prompt.append("- Pet nutrition: Dog and cat dietary needs, protein requirements\n");
            prompt.append("- Meal planning: Portion sizes, feeding schedules, treats\n");
            prompt.append("- Health advice: Weight management, allergies, special diets\n");
            prompt.append("- Product recommendations: Best cuts for pets, preparation methods\n\n");

        } else {
            // General MEATHUB AI Assistant
            prompt.append(
                    "You are MEATHUB AI Assistant - a friendly, helpful, and conversational assistant for a meat delivery platform in India.\n\n");
            prompt.append("YOUR PERSONALITY:\n");
            prompt.append("- Be warm, friendly, and genuinely helpful (like talking to a knowledgeable friend)\n");
            prompt.append("- Show enthusiasm about helping users\n");
            prompt.append("- Use a natural, conversational tone - never sound robotic or formal\n");
            prompt.append("- Be patient and understanding\n");
            prompt.append("- Show genuine interest in helping users get the best meat products\n\n");

            prompt.append("Your capabilities:\n");
            prompt.append("- Place orders end-to-end (extract product, quantity, confirm)\n");
            prompt.append("- Cancel orders in seconds (if cancellable)\n");
            prompt.append("- Track deliveries with real-time narration\n");
            prompt.append("- Explain charges and order details\n");
            prompt.append("- Suggest meat for today based on context\n");
            prompt.append("- Provide cooking guidance and recipe help\n");
            prompt.append("- Switch language instantly\n\n");

            prompt.append("Guidelines:\n");
            prompt.append("- Be warm, friendly, and conversational (like a friend, not a robot)\n");
            prompt.append("- Use Indian English naturally (e.g., 'kg', 'Rs', 'PM')\n");
            prompt.append("- When user wants to order, extract details and confirm before placing\n");
            prompt.append("- When tracking orders, narrate the journey emotionally and reassuringly\n");
            prompt.append("- When explaining delays, be empathetic and reassuring\n");
            prompt.append("- Provide actionable responses, not just information\n");
            prompt.append("- Use emojis sparingly (1-2 max per message) - only when it adds warmth\n");
            prompt.append("- Always sound friendly and approachable - make users feel welcome\n");
            prompt.append("- Ask follow-up questions to better understand user needs\n\n");
        }

        // Intent-specific additions
        switch (intent) {
            case "ORDER_MEAT":
                prompt.append("The user wants to order meat. Help them understand what's available and guide them.\n");
                break;
            case "TRACK_ORDER":
                prompt.append(
                        "The user wants to track their order. I'll fetch their order details, so acknowledge that.\n");
                break;
            case "COOKING_HELP":
                prompt.append("The user needs cooking help. Provide helpful recipe suggestions and cooking tips.\n");
                break;
            case "SUGGEST_MEAT":
                prompt.append("The user wants product recommendations. Suggest based on common use cases.\n");
                break;
        }

        return prompt.toString();
    }

    /**
     * Build user prompt with context
     */
    private String buildUserPrompt(String message, List<ChatHistory> history, String intent) {
        StringBuilder prompt = new StringBuilder();

        // Add recent conversation context
        if (!history.isEmpty()) {
            prompt.append("Recent conversation:\n");
            for (int i = history.size() - 1; i >= 0; i--) {
                ChatHistory h = history.get(i);
                prompt.append("User: ").append(h.getUserMessage()).append("\n");
                prompt.append("Assistant: ").append(h.getAiResponse()).append("\n");
            }
            prompt.append("\n");
        }

        prompt.append("Current user message: ").append(message);

        return prompt.toString();
    }

    /**
     * Call AI provider (OpenAI or Gemini)
     */
    private String callAIProvider(String systemPrompt, String userPrompt) {
        if (aiProvider.equalsIgnoreCase("openai")) {
            return callOpenAI(systemPrompt, userPrompt);
        } else if (aiProvider.equalsIgnoreCase("gemini")) {
            return callGemini(systemPrompt, userPrompt);
        } else {
            return "AI service is not configured. Please contact support.";
        }
    }

    /**
     * Call OpenAI API
     */
    private String callOpenAI(String systemPrompt, String userPrompt) {
        if (openaiApiKey.isEmpty() || openaiApiKey.equals("your-api-key-here")) {
            log.warn("OpenAI API key not configured");
            return "AI assistant is not configured. Please contact support.";
        }

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", openaiModel);
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 500);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));
            messages.add(Map.of("role", "user", "content", userPrompt));
            requestBody.put("messages", messages);

            String response = webClient.post()
                    .uri("https://api.openai.com/v1/chat/completions")
                    .header("Authorization", "Bearer " + openaiApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            // Parse OpenAI response
            Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseMap.get("choices");
            if (!choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                return (String) message.get("content");
            }

        } catch (Exception e) {
            log.error("Error calling OpenAI", e);
        }

        return "I'm having trouble processing your request. Please try again.";
    }

    /**
     * Call Google Gemini API (Updated for Gemini 1.5 Flash)
     */
    private String callGemini(String systemPrompt, String userPrompt) {
        if (geminiApiKey.isEmpty() || geminiApiKey.equals("your-api-key-here")) {
            log.warn("Gemini API key not configured");
            return "AI assistant is not configured. Please set GEMINI_API_KEY environment variable or add gemini.api.key to application.properties";
        }

        try {
            // Build request body for Gemini API v1beta
            Map<String, Object> requestBody = new HashMap<>();

            // Combine system prompt and user prompt for Gemini (simpler format)
            String combinedPrompt = systemPrompt + "\n\n" + userPrompt;

            // Contents array (required format)
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> userContent = new HashMap<>();
            List<Map<String, String>> geminiParts = new ArrayList<>();
            geminiParts.add(Map.of("text", combinedPrompt));
            userContent.put("parts", geminiParts);
            contents.add(userContent);
            requestBody.put("contents", contents);

            // Generation config
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", geminiTemperature);
            generationConfig.put("maxOutputTokens", geminiMaxTokens);
            generationConfig.put("topP", 0.95);
            generationConfig.put("topK", 40);
            requestBody.put("generationConfig", generationConfig);

            // Safety settings (optional but recommended)
            List<Map<String, String>> safetySettings = new ArrayList<>();
            safetySettings.add(Map.of("category", "HARM_CATEGORY_HARASSMENT", "threshold", "BLOCK_MEDIUM_AND_ABOVE"));
            safetySettings.add(Map.of("category", "HARM_CATEGORY_HATE_SPEECH", "threshold", "BLOCK_MEDIUM_AND_ABOVE"));
            safetySettings
                    .add(Map.of("category", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold", "BLOCK_MEDIUM_AND_ABOVE"));
            safetySettings
                    .add(Map.of("category", "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold", "BLOCK_MEDIUM_AND_ABOVE"));
            requestBody.put("safetySettings", safetySettings);

            String apiUrl = String.format(
                    "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                    geminiModel, geminiApiKey);

            log.debug("Calling Gemini API: {}", apiUrl);

            String response;
            try {
                response = webClient.post()
                        .uri(apiUrl)
                        .header("Content-Type", "application/json")
                        .bodyValue(requestBody)
                        .retrieve()
                        .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), clientResponse -> {
                            return clientResponse.bodyToMono(String.class)
                                    .flatMap(errorBody -> {
                                        log.error("Gemini API HTTP error {}: {}", clientResponse.statusCode(),
                                                errorBody);
                                        return Mono.error(new RuntimeException("Gemini API error: "
                                                + clientResponse.statusCode() + " - " + errorBody));
                                    });
                        })
                        .bodyToMono(String.class)
                        .block();
            } catch (Exception e) {
                log.error("Exception calling Gemini API", e);
                throw e;
            }

            if (response == null || response.isEmpty()) {
                log.error("Gemini API returned empty response");
                return "I received your message but couldn't generate a response. Please try again.";
            }

            log.debug("Gemini API response received (length: {})", response.length());

            // Parse Gemini response
            Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);

            // Check for errors
            if (responseMap.containsKey("error")) {
                Map<String, Object> error = (Map<String, Object>) responseMap.get("error");
                String errorMessage = (String) error.getOrDefault("message", "Unknown error");
                log.error("Gemini API error: {}", errorMessage);
                return "I'm having trouble connecting to the AI service. Please try again later.";
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                if (content != null) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> responseParts = (List<Map<String, Object>>) content.get("parts");
                    if (responseParts != null && !responseParts.isEmpty()) {
                        String text = (String) responseParts.get(0).get("text");
                        if (text != null && !text.isEmpty()) {
                            return text;
                        }
                    }
                }
            }

            log.warn("Gemini API returned empty response");
            return "I received your message but couldn't generate a response. Please try again.";

        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            if (e.getMessage() != null) {
                log.error("Error message: {}", e.getMessage());
            }
        }

        return "I'm having trouble processing your request. Please try again.";
    }

    /**
     * Execute actions based on intent
     */
    private Object executeAction(String intent, String message, String authToken) {
        try {
            switch (intent) {
                case "TRACK_ORDER":
                    return fetchUserOrders(authToken);
                case "ORDER_MEAT":
                    return fetchAvailableProducts();
                case "SUGGEST_MEAT":
                    return fetchAvailableProducts();
                default:
                    return null;
            }
        } catch (Exception e) {
            log.error("Error executing action", e);
            return null;
        }
    }

    /**
     * Fetch user orders
     */
    private Object fetchUserOrders(String authToken) {
        try {
            return webClient.get()
                    .uri(gatewayUrl + "/orders/my")
                    .header("Authorization", "Bearer " + authToken)
                    .retrieve()
                    .bodyToMono(Object.class)
                    .block();
        } catch (Exception e) {
            log.error("Error fetching orders", e);
            return null;
        }
    }

    /**
     * Fetch available products
     */
    private Object fetchAvailableProducts() {
        try {
            return webClient.get()
                    .uri(gatewayUrl + "/butchers/items/available")
                    .retrieve()
                    .bodyToMono(Object.class)
                    .block();
        } catch (Exception e) {
            log.error("Error fetching products", e);
            return null;
        }
    }

    /**
     * Fallback response when AI is disabled - Enhanced with smart rules
     */
    private ChatResponse fallbackResponse(String message) {
        String intent = intentDetectionService.detectIntent(message);
        String lowerMessage = message.toLowerCase();
        String responseText;

        // Intent-based responses
        switch (intent) {
            case "ORDER_MEAT":
                responseText = "I'd love to help you order! 🥩\n\n" +
                        "We have:\n" +
                        "• Chicken - Breast, curry cut, thighs, legs\n" +
                        "• Mutton - Curry cut, boneless, with bones\n" +
                        "• Fish - Fresh catch daily\n" +
                        "• Prawns - Large, medium\n\n" +
                        "What would you like to order?";
                break;

            case "TRACK_ORDER":
                responseText = "Let me check your order status! 📦\n\n" +
                        "Your orders are being freshly prepared by our expert butchers. " +
                        "You can track your order from the Orders page in your profile.\n\n" +
                        "Need help with a specific order? Just tell me the order number!";
                break;

            case "COOKING_HELP":
                if (lowerMessage.contains("chicken")) {
                    responseText = "Here are some great chicken recipes! 🍗\n\n" +
                            "**For Chicken Breast:**\n" +
                            "• Grilled Lemon Herb (20 mins)\n" +
                            "• Pan-seared Garlic Butter (15 mins)\n" +
                            "• Healthy Salad (10 mins)\n\n" +
                            "**For Chicken Curry Cut:**\n" +
                            "• Classic Chicken Curry (30 mins)\n" +
                            "• Butter Chicken (40 mins)\n" +
                            "• Tandoori Chicken (25 mins)\n\n" +
                            "Want detailed instructions for any recipe?";
                } else if (lowerMessage.contains("mutton")) {
                    responseText = "Delicious mutton recipes! 🍖\n\n" +
                            "• Rich Mutton Curry (1 hour slow cook)\n" +
                            "• Mutton Biryani (1.5 hours)\n" +
                            "• Mutton Rogan Josh (50 mins)\n" +
                            "• Mutton Keema (30 mins)\n\n" +
                            "Tip: Slow cooking makes mutton tender and flavorful!";
                } else {
                    responseText = "I'd love to help you cook! 👨‍🍳\n\n" +
                            "Tell me:\n" +
                            "• What meat do you have?\n" +
                            "• How much time do you have?\n" +
                            "• Any preferences (spicy, mild, grilled)?\n\n" +
                            "I'll suggest the perfect recipe!";
                }
                break;

            case "SUGGEST_MEAT":
                responseText = "Here are my recommendations based on what's popular! ⭐\n\n" +
                        "**For Daily Cooking:**\n" +
                        "• Chicken Curry Cut - Versatile, quick\n" +
                        "• Boneless Mutton - Easy to cook\n\n" +
                        "**For Fitness & Gym:**\n" +
                        "• Chicken Breast - High protein, lean\n" +
                        "• Fish - Omega-3, low fat\n\n" +
                        "**For Special Occasions:**\n" +
                        "• Mutton Biryani Cut\n" +
                        "• Fresh Prawns\n\n" +
                        "What's your occasion today?";
                break;

            case "SUBSCRIPTION_QUERY":
                responseText = "Subscriptions are a great choice! 📅\n\n" +
                        "Benefits:\n" +
                        "• Save 10% on every order\n" +
                        "• Never run out of fresh meat\n" +
                        "• Flexible delivery schedule\n" +
                        "• Pause anytime\n\n" +
                        "Options:\n" +
                        "• Daily delivery\n" +
                        "• Weekly (specific days)\n" +
                        "• Gym protein plans (250g-500g daily)\n\n" +
                        "Would you like to set one up?";
                break;

            case "GENERAL_CHAT":
                // Handle common greetings and questions
                if (lowerMessage.matches(".*\\b(hi|hello|hey|namaste)\\b.*")) {
                    responseText = "Hello! 👋 I'm your MEATHUB assistant.\n\n" +
                            "I'm here to help you with:\n" +
                            "• Ordering fresh meat\n" +
                            "• Tracking deliveries\n" +
                            "• Recipe suggestions\n" +
                            "• Cooking tips\n" +
                            "• Subscription plans\n\n" +
                            "What would you like to do today?";
                } else if (lowerMessage.contains("help") || lowerMessage.contains("what can you do")) {
                    responseText = "I can help you with many things! 🎯\n\n" +
                            "**Quick Actions:**\n" +
                            "• 'Order chicken' - Place orders fast\n" +
                            "• 'Track my order' - Check delivery status\n" +
                            "• 'Cooking tips' - Get recipe help\n" +
                            "• 'Suggest meat' - Product recommendations\n\n" +
                            "Just tell me what you need!";
                } else if (lowerMessage.contains("thank")) {
                    responseText = "You're very welcome! 😊\n\n" +
                            "Is there anything else I can help you with today?";
                } else {
                    responseText = "I'm here to help! 🙂\n\n" +
                            "You can ask me about:\n" +
                            "• Ordering meat products\n" +
                            "• Tracking your deliveries\n" +
                            "• Cooking recipes and tips\n" +
                            "• Subscription plans\n\n" +
                            "What would you like to know?";
                }
                break;

            default:
                responseText = "I'm listening! 👂\n\n" +
                        "I can help you with:\n" +
                        "• Fresh meat orders\n" +
                        "• Delivery tracking\n" +
                        "• Cooking guidance\n" +
                        "• Product suggestions\n\n" +
                        "What would you like help with?";
        }

        ChatResponse chatResponse = new ChatResponse();
        chatResponse.setResponse(responseText);
        chatResponse.setDetectedIntent(intent);
        return chatResponse;
    }

    /**
     * Save chat history
     */
    private void saveChatHistory(Long userId, String userMessage, String aiResponse) {
        try {
            ChatHistory history = new ChatHistory();
            history.setUserId(userId);
            history.setUserMessage(userMessage);
            history.setAiResponse(aiResponse);
            // createdAt is auto-set by @CreationTimestamp
            chatHistoryRepository.save(history);
        } catch (Exception e) {
            log.error("Error saving chat history", e);
        }
    }

    /**
     * Generate narration using AI (used by OrderNarrationService)
     */
    public String generateNarration(String systemPrompt, String userPrompt) {
        if (!aiEnabled) {
            return "Your order is being processed. We'll update you soon!";
        }
        return callAIProvider(systemPrompt, userPrompt);
    }
}
