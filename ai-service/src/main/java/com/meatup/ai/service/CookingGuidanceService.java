package com.meatup.ai.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * 🎯 HIGH-IMPACT FEATURE #3: Cooking & Food Confidence
 * 
 * Helps users cook better, reduces fear of spoiling meat,
 * makes MeatHub a food partner, not just a seller.
 */
@Service
@Slf4j
public class CookingGuidanceService {

    @Autowired
    private GenAIService genAIService;

    @Value("${ai.enabled:false}")
    private boolean aiEnabled;

    /**
     * Provide instant dish guidance
     * Example: "How do I cook chicken curry?"
     */
    public String provideCookingGuidance(String dish, String meatType, String cut) {
        if (!aiEnabled) {
            return generateFallbackCookingGuidance(dish, meatType, cut);
        }

        try {
            String systemPrompt = buildCookingSystemPrompt();
            String userPrompt = buildCookingUserPrompt(dish, meatType, cut);

            return genAIService.generateNarration(systemPrompt, userPrompt);
        } catch (Exception e) {
            log.error("Error providing cooking guidance", e);
            return generateFallbackCookingGuidance(dish, meatType, cut);
        }
    }

    /**
     * Correct cooking mistakes
     * Example: "I added too much water to my curry"
     */
    public String correctMistake(String mistake, String dish) {
        if (!aiEnabled) {
            return generateFallbackMistakeCorrection(mistake);
        }

        try {
            String systemPrompt = """
                You are MEATHUB's Cooking Expert helping fix cooking mistakes.
                Be reassuring, practical, and solution-focused.
                Don't panic the user - mistakes can be fixed!
                Use Indian cooking terminology.
                Keep responses to 2-3 sentences max.
                """;
            
            String userPrompt = String.format(
                "User made a mistake while cooking %s: %s\n\nProvide a helpful, reassuring solution.",
                dish != null ? dish : "their dish", mistake
            );

            return genAIService.generateNarration(systemPrompt, userPrompt);
        } catch (Exception e) {
            log.error("Error correcting mistake", e);
            return generateFallbackMistakeCorrection(mistake);
        }
    }

    /**
     * Suggest dish based on meat type and cut
     */
    public String suggestDish(String meatType, String cut, String occasion) {
        if (!aiEnabled) {
            return generateFallbackDishSuggestion(meatType, cut);
        }

        try {
            String systemPrompt = """
                You are MEATHUB's Cooking Expert suggesting dishes.
                Suggest 2-3 popular Indian dishes based on the meat type and cut.
                Be enthusiastic and make it sound delicious!
                Use Indian English.
                Keep it to 2-3 sentences.
                """;
            
            String userPrompt = String.format(
                "Suggest dishes for %s (%s)%s",
                meatType, cut != null ? cut : "any cut",
                occasion != null ? " for " + occasion : ""
            );

            return genAIService.generateNarration(systemPrompt, userPrompt);
        } catch (Exception e) {
            log.error("Error suggesting dish", e);
            return generateFallbackDishSuggestion(meatType, cut);
        }
    }

    /**
     * Provide personalized cooking advice
     */
    public String providePersonalizedAdvice(String meatType, String userLevel, String preference) {
        if (!aiEnabled) {
            return "Here's a simple tip: Marinate your " + meatType + " for at least 30 minutes for better flavor!";
        }

        try {
            String systemPrompt = """
                You are MEATHUB's Cooking Expert providing personalized advice.
                Adapt your advice based on the user's cooking level (beginner/intermediate/advanced).
                Be encouraging and practical.
                Use Indian cooking terminology.
                Keep it to 2-3 sentences.
                """;
            
            String userPrompt = String.format(
                "Provide cooking advice for %s. User level: %s. Preference: %s",
                meatType, userLevel != null ? userLevel : "beginner",
                preference != null ? preference : "general"
            );

            return genAIService.generateNarration(systemPrompt, userPrompt);
        } catch (Exception e) {
            log.error("Error providing personalized advice", e);
            return "Here's a simple tip: Marinate your " + meatType + " for at least 30 minutes for better flavor!";
        }
    }

    // Helper methods

    private String buildCookingSystemPrompt() {
        return """
            You are MEATHUB's Cooking Expert - a friendly guide helping users cook delicious meat dishes.
            
            Your role:
            - Provide clear, step-by-step cooking guidance
            - Use Indian cooking terminology (tadka, masala, etc.)
            - Be encouraging and build confidence
            - Suggest practical tips and shortcuts
            - Keep instructions concise but complete
            
            Guidelines:
            - Start with preparation steps (marination, cutting)
            - Explain cooking process clearly
            - Mention common mistakes to avoid
            - Suggest serving ideas
            - Use Indian measurements (tsp, tbsp, cups)
            - Keep responses to 4-5 sentences max
            
            Tone: Warm, encouraging, like a friend teaching you to cook.
            """;
    }

    private String buildCookingUserPrompt(String dish, String meatType, String cut) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("User wants to cook: ").append(dish != null ? dish : "a dish");
        if (meatType != null) {
            prompt.append(" using ").append(meatType);
        }
        if (cut != null) {
            prompt.append(" (").append(cut).append(")");
        }
        prompt.append("\n\nProvide clear, step-by-step cooking guidance.");
        return prompt.toString();
    }

    private String generateFallbackCookingGuidance(String dish, String meatType, String cut) {
        String base = "Here's how to cook ";
        if (dish != null) {
            return base + dish + ": 1) Marinate the meat for 30 mins, 2) Heat oil and add spices, 3) Add meat and cook until tender, 4) Add water and simmer. Enjoy! 🍛";
        }
        if (meatType != null) {
            return base + meatType + ": Marinate for 30 mins, then cook with spices until tender. Add water and simmer for best results! 🍛";
        }
        return "For cooking guidance, try our Media section or ask about a specific dish!";
    }

    private String generateFallbackMistakeCorrection(String mistake) {
        String lower = mistake.toLowerCase();
        
        if (lower.contains("water") || lower.contains("too much")) {
            return "Too much water? Don't panic! Reduce the flame and let it simmer uncovered. The water will evaporate. Add a bit of cornflour slurry if needed to thicken. Your dish will be fine! 🙏";
        }
        if (lower.contains("salt") || lower.contains("salty")) {
            return "Too much salt? Add a raw potato or a bit of sugar to balance. Or add more water and adjust spices. Don't worry, it's fixable!";
        }
        if (lower.contains("burn") || lower.contains("burnt")) {
            return "Burnt the bottom? Don't scrape it! Transfer the top portion to a new pan. The burnt taste won't spread if you're careful. Your dish can still be saved!";
        }
        
        return "Don't worry! Most cooking mistakes can be fixed. Try adjusting the flame, adding a bit of water, or adjusting spices. Your dish will turn out fine! 🙏";
    }

    private String generateFallbackDishSuggestion(String meatType, String cut) {
        if (meatType == null) {
            return "For chicken curry cut, try: Chicken Curry, Butter Chicken, or Chicken Biryani. For boneless, try: Chicken Tikka, Chicken 65, or Chicken Kebab! 🍗";
        }
        
        String lower = meatType.toLowerCase();
        if (lower.contains("chicken")) {
            return "Great choice! Try Chicken Curry, Butter Chicken, or Chicken Biryani. All perfect for " + (cut != null ? cut : "this cut") + "! 🍗";
        }
        if (lower.contains("mutton")) {
            return "Mutton is perfect for Mutton Curry, Mutton Biryani, or Mutton Korma. Rich and flavorful! 🐑";
        }
        
        return "Try a curry, biryani, or kebab! All work great with " + meatType + ".";
    }
}

