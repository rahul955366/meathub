package com.meatup.ai.service;

import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class IntentDetectionService {

    public String detectIntent(String message) {
        String lower = message.toLowerCase();

        if (matches(lower, ".*(order|buy|get).*")) {
            return "ORDER_MEAT";
        } else if (matches(lower, ".*(cancel|stop).*")) {
            return "CANCEL_ORDER";
        } else if (matches(lower, ".*(track|where|status).*")) {
            return "TRACK_ORDER";
        } else if (matches(lower, ".*(cook|recipe|make).*")) {
            return "COOKING_HELP";
        } else if (matches(lower, ".*(suggest|recommend|best).*")) {
            return "SUGGEST_MEAT";
        }

        return "GENERAL_CHAT";
    }

    private boolean matches(String text, String regex) {
        return Pattern.compile(regex).matcher(text).matches();
    }
}
