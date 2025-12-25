package com.meatup.ai.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

/**
 * 🎯 HIGH-IMPACT FEATURE #2: Actionable AI Assistant
 * 
 * Makes AI DO THINGS, not just talk.
 * Can place orders, cancel orders, track deliveries end-to-end.
 */
@Service
@Slf4j
public class ActionExecutorService {

    @Autowired
    private OrderNarrationService orderNarrationService;

    @Value("${gateway.url:http://localhost:8000}")
    private String gatewayUrl;

    private final WebClient webClient;

    public ActionExecutorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8000").build();
    }

    /**
     * Execute action based on intent and extracted entities
     */
    public ActionResult executeAction(String intent, String message, String authToken, Map<String, Object> entities) {
        return switch (intent) {
            case "ORDER_MEAT" -> placeOrder(message, authToken, entities);
            case "CANCEL_ORDER" -> cancelOrder(message, authToken, entities);
            case "TRACK_ORDER" -> trackOrder(message, authToken, entities);
            case "EXPLAIN_CHARGES" -> explainCharges(message, authToken, entities);
            case "SUGGEST_MEAT" -> suggestMeat(message, authToken, entities);
            default -> ActionResult.noAction();
        };
    }

    /**
     * Place order end-to-end
     * Example: "Order half kg chicken curry cut"
     */
    private ActionResult placeOrder(String message, String authToken, Map<String, Object> entities) {
        try {
            // Extract order details from message
            String productName = (String) entities.getOrDefault("product", extractProductFromMessage(message));
            String quantity = (String) entities.getOrDefault("quantity", extractQuantityFromMessage(message));
            String cut = (String) entities.getOrDefault("cut", extractCutFromMessage(message));

            // If details are incomplete, return a response asking for clarification
            if (productName == null || quantity == null) {
                return ActionResult.incomplete("I'd love to help you order! Could you tell me:\n" +
                    "- What meat do you want? (e.g., chicken, mutton)\n" +
                    "- How much? (e.g., 500g, 1kg)\n" +
                    "- Any specific cut? (e.g., curry cut, boneless)");
            }

            // Fetch available products to find matching item
            List<Map<String, Object>> products = fetchAvailableProducts(authToken);
            Map<String, Object> matchingProduct = findMatchingProduct(products, productName, cut);

            if (matchingProduct == null) {
                return ActionResult.error("I couldn't find " + productName + 
                    (cut != null ? " (" + cut + ")" : "") + 
                    ". Would you like to see available products?");
            }

            // Add to cart
            Map<String, Object> cartRequest = new HashMap<>();
            cartRequest.put("itemId", matchingProduct.get("id"));
            cartRequest.put("quantity", parseQuantity(quantity));

            try {
                Object cartResponse = webClient.post()
                    .uri(gatewayUrl + "/cart/add")
                    .header("Authorization", "Bearer " + authToken)
                    .bodyValue(cartRequest)
                    .retrieve()
                    .bodyToMono(Object.class)
                    .block();

                return ActionResult.success(
                    "Done! I've added " + quantity + " " + productName + 
                    (cut != null ? " (" + cut + ")" : "") + " to your cart. " +
                    "Would you like to place the order now?",
                    cartResponse
                );
            } catch (Exception e) {
                log.error("Error adding to cart", e);
                return ActionResult.error("I had trouble adding that to your cart. Please try again or use the app directly.");
            }

        } catch (Exception e) {
            log.error("Error placing order", e);
            return ActionResult.error("I encountered an error. Please try again or use the app directly.");
        }
    }

    /**
     * Cancel order
     * Example: "Cancel my order" or "Cancel order #ORD123"
     */
    private ActionResult cancelOrder(String message, String authToken, Map<String, Object> entities) {
        try {
            // Get user's orders
            List<Map<String, Object>> orders = fetchUserOrders(authToken);
            
            if (orders == null || orders.isEmpty()) {
                return ActionResult.error("You don't have any active orders to cancel.");
            }

            // Find order to cancel (latest or by order number)
            Map<String, Object> orderToCancel = findOrderToCancel(orders, message, entities);
            
            if (orderToCancel == null) {
                return ActionResult.error("I couldn't find that order. Here are your recent orders:");
            }

            String status = (String) orderToCancel.get("status");
            if (!"PENDING".equals(status) && !"CONFIRMED".equals(status)) {
                return ActionResult.error("Sorry, this order can't be cancelled anymore. " +
                    "It's already being prepared. Status: " + status);
            }

            // Cancel the order
            Map<String, Object> cancelRequest = new HashMap<>();
            cancelRequest.put("reason", "Cancelled via AI assistant");

            try {
                Long orderId = Long.parseLong(orderToCancel.get("id").toString());
                Object cancelResponse = webClient.post()
                    .uri(gatewayUrl + "/orders/" + orderId + "/cancel")
                    .header("Authorization", "Bearer " + authToken)
                    .bodyValue(cancelRequest)
                    .retrieve()
                    .bodyToMono(Object.class)
                    .block();

                return ActionResult.success(
                    "Done! I've cancelled your order #" + orderToCancel.get("orderNumber") + 
                    ". Your refund will be processed within 2-3 business days.",
                    cancelResponse
                );
            } catch (Exception e) {
                log.error("Error cancelling order", e);
                return ActionResult.error("I had trouble cancelling that order. Please try again.");
            }

        } catch (Exception e) {
            log.error("Error cancelling order", e);
            return ActionResult.error("I encountered an error. Please try again.");
        }
    }

    /**
     * Track order with emotional narration
     */
    private ActionResult trackOrder(String message, String authToken, Map<String, Object> entities) {
        try {
            List<Map<String, Object>> orders = fetchUserOrders(authToken);
            
            if (orders == null || orders.isEmpty()) {
                return ActionResult.error("You don't have any orders yet.");
            }

            // Find order to track (latest or by order number)
            Map<String, Object> orderToTrack = findOrderToTrack(orders, message, entities);
            
            if (orderToTrack == null) {
                return ActionResult.error("I couldn't find that order. Here are your recent orders:");
            }

            // Generate emotional narration
            String narration = orderNarrationService.narrateOrderStatus(orderToTrack, authToken);

            // Get delivery details if available
            try {
                Long orderId = Long.parseLong(orderToTrack.get("id").toString());
                Object deliveryInfo = webClient.get()
                    .uri(gatewayUrl + "/deliveries/order/" + orderId)
                    .header("Authorization", "Bearer " + authToken)
                    .retrieve()
                    .bodyToMono(Object.class)
                    .onErrorReturn(new HashMap<>())
                    .block();

                Map<String, Object> result = new HashMap<>();
                result.put("order", orderToTrack);
                result.put("delivery", deliveryInfo);
                result.put("narration", narration);

                return ActionResult.success(narration, result);
            } catch (Exception e) {
                return ActionResult.success(narration, orderToTrack);
            }

        } catch (Exception e) {
            log.error("Error tracking order", e);
            return ActionResult.error("I had trouble tracking your order. Please try again.");
        }
    }

    /**
     * Explain charges for an order
     */
    private ActionResult explainCharges(String message, String authToken, Map<String, Object> entities) {
        try {
            List<Map<String, Object>> orders = fetchUserOrders(authToken);
            Map<String, Object> order = findOrderToTrack(orders, message, entities);
            
            if (order == null) {
                return ActionResult.error("I couldn't find that order.");
            }

            List<Map<String, Object>> items = (List<Map<String, Object>>) order.get("items");
            Double totalAmount = Double.parseDouble(order.get("totalAmount").toString());

            StringBuilder explanation = new StringBuilder();
            explanation.append("Here's the breakdown for order #").append(order.get("orderNumber")).append(":\n\n");
            
            double itemsTotal = 0;
            for (Map<String, Object> item : items) {
                Double price = Double.parseDouble(item.get("price").toString());
                Integer quantity = Integer.parseInt(item.get("quantity").toString());
                double itemTotal = price * quantity;
                itemsTotal += itemTotal;
                
                explanation.append("• ").append(item.get("productName"))
                    .append(" (").append(quantity).append("x)")
                    .append(": Rs ").append(String.format("%.2f", itemTotal)).append("\n");
            }
            
            explanation.append("\nTotal: Rs ").append(String.format("%.2f", totalAmount));
            
            if (totalAmount > itemsTotal) {
                double deliveryFee = totalAmount - itemsTotal;
                explanation.append("\n(Delivery fee: Rs ").append(String.format("%.2f", deliveryFee)).append(")");
            }

            return ActionResult.success(explanation.toString(), order);

        } catch (Exception e) {
            log.error("Error explaining charges", e);
            return ActionResult.error("I had trouble explaining the charges. Please check your order details.");
        }
    }

    /**
     * Suggest meat based on context (weather, occasion, time of day)
     */
    private ActionResult suggestMeat(String message, String authToken, Map<String, Object> entities) {
        try {
            List<Map<String, Object>> products = fetchAvailableProducts(authToken);
            
            // Simple suggestion logic (can be enhanced with AI)
            String context = message.toLowerCase();
            List<Map<String, Object>> suggestions = new ArrayList<>();

            if (context.contains("rain") || context.contains("rainy")) {
                // Suggest warming dishes
                suggestions = filterProducts(products, Arrays.asList("chicken", "mutton"));
            } else if (context.contains("gym") || context.contains("workout")) {
                // Suggest lean protein
                suggestions = filterProducts(products, Arrays.asList("chicken breast", "boneless"));
            } else if (context.contains("sunday") || context.contains("weekend")) {
                // Suggest family packs
                suggestions = filterProducts(products, Arrays.asList("family pack", "combo"));
            } else {
                // Default: popular items
                suggestions = products.subList(0, Math.min(3, products.size()));
            }

            StringBuilder response = new StringBuilder("Based on your context, here are my suggestions:\n\n");
            for (int i = 0; i < Math.min(3, suggestions.size()); i++) {
                Map<String, Object> product = suggestions.get(i);
                response.append((i + 1)).append(". ").append(product.get("name"))
                    .append(" - Rs ").append(product.get("price")).append("\n");
            }
            response.append("\nWould you like to order any of these?");

            return ActionResult.success(response.toString(), suggestions);

        } catch (Exception e) {
            log.error("Error suggesting meat", e);
            return ActionResult.error("I had trouble suggesting products. Please browse our catalog.");
        }
    }

    // Helper methods

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchUserOrders(String authToken) {
        try {
            Object response = webClient.get()
                .uri(gatewayUrl + "/orders/my")
                .header("Authorization", "Bearer " + authToken)
                .retrieve()
                .bodyToMono(Object.class)
                .block();

            if (response instanceof List) {
                return (List<Map<String, Object>>) response;
            }
            return Collections.emptyList();
        } catch (Exception e) {
            log.error("Error fetching orders", e);
            return Collections.emptyList();
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchAvailableProducts(String authToken) {
        try {
            Object response = webClient.get()
                .uri(gatewayUrl + "/butchers/items/available")
                .retrieve()
                .bodyToMono(Object.class)
                .block();

            if (response instanceof List) {
                return (List<Map<String, Object>>) response;
            }
            return Collections.emptyList();
        } catch (Exception e) {
            log.error("Error fetching products", e);
            return Collections.emptyList();
        }
    }

    private Map<String, Object> findOrderToCancel(List<Map<String, Object>> orders, String message, Map<String, Object> entities) {
        // Try to find by order number first
        String orderNumber = extractOrderNumber(message);
        if (orderNumber != null) {
            return orders.stream()
                .filter(o -> orderNumber.equals(o.get("orderNumber")))
                .findFirst()
                .orElse(null);
        }
        
        // Otherwise return latest order
        return orders.isEmpty() ? null : orders.get(0);
    }

    private Map<String, Object> findOrderToTrack(List<Map<String, Object>> orders, String message, Map<String, Object> entities) {
        return findOrderToCancel(orders, message, entities); // Same logic
    }

    private Map<String, Object> findMatchingProduct(List<Map<String, Object>> products, String productName, String cut) {
        String lowerProduct = productName.toLowerCase();
        String lowerCut = cut != null ? cut.toLowerCase() : "";
        
        return products.stream()
            .filter(p -> {
                String name = p.get("name").toString().toLowerCase();
                return name.contains(lowerProduct) && 
                       (lowerCut.isEmpty() || name.contains(lowerCut));
            })
            .findFirst()
            .orElse(null);
    }

    private List<Map<String, Object>> filterProducts(List<Map<String, Object>> products, List<String> keywords) {
        List<Map<String, Object>> filtered = new ArrayList<>();
        for (Map<String, Object> product : products) {
            String name = product.get("name").toString().toLowerCase();
            if (keywords.stream().anyMatch(k -> name.contains(k.toLowerCase()))) {
                filtered.add(product);
            }
        }
        return filtered.isEmpty() ? products.subList(0, Math.min(3, products.size())) : filtered;
    }

    // Entity extraction helpers (simple regex-based, can be enhanced with NLP)

    private String extractProductFromMessage(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("chicken")) return "chicken";
        if (lower.contains("mutton")) return "mutton";
        if (lower.contains("fish")) return "fish";
        if (lower.contains("prawn")) return "prawn";
        return null;
    }

    private String extractQuantityFromMessage(String message) {
        // Match patterns like "500g", "1kg", "half kg", "0.5kg"
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile(
            "(\\d+\\.?\\d*)\\s*(kg|g|gram|kilo)|(half|quarter)\\s*(kg|kilo)?"
        );
        java.util.regex.Matcher matcher = pattern.matcher(message.toLowerCase());
        if (matcher.find()) {
            return matcher.group();
        }
        return null;
    }

    private String extractCutFromMessage(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("curry cut")) return "curry cut";
        if (lower.contains("boneless")) return "boneless";
        if (lower.contains("with bone")) return "with bone";
        return null;
    }

    private String extractOrderNumber(String message) {
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("(ORD|#)\\s*\\d+");
        java.util.regex.Matcher matcher = pattern.matcher(message.toUpperCase());
        if (matcher.find()) {
            return matcher.group().replaceAll("[^0-9]", "");
        }
        return null;
    }

    private Integer parseQuantity(String quantity) {
        if (quantity == null) return 1;
        
        String lower = quantity.toLowerCase();
        if (lower.contains("half")) return 500; // grams
        if (lower.contains("quarter")) return 250; // grams
        
        // Extract number
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("(\\d+\\.?\\d*)");
        java.util.regex.Matcher matcher = pattern.matcher(quantity);
        if (matcher.find()) {
            double num = Double.parseDouble(matcher.group());
            if (lower.contains("kg") || lower.contains("kilo")) {
                return (int) (num * 1000); // Convert to grams
            }
            return (int) num;
        }
        
        return 1;
    }

    /**
     * Result of an action execution
     */
    public static class ActionResult {
        private boolean success;
        private boolean hasAction;
        private String message;
        private Object data;

        private ActionResult(boolean success, boolean hasAction, String message, Object data) {
            this.success = success;
            this.hasAction = hasAction;
            this.message = message;
            this.data = data;
        }

        public static ActionResult success(String message, Object data) {
            return new ActionResult(true, true, message, data);
        }

        public static ActionResult error(String message) {
            return new ActionResult(false, true, message, null);
        }

        public static ActionResult incomplete(String message) {
            return new ActionResult(false, true, message, null);
        }

        public static ActionResult noAction() {
            return new ActionResult(false, false, null, null);
        }

        // Getters
        public boolean isSuccess() { return success; }
        public boolean hasAction() { return hasAction; }
        public String getMessage() { return message; }
        public Object getData() { return data; }
    }
}

