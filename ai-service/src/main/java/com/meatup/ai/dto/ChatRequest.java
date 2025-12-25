package com.meatup.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    private String message;
    private String language; // "EN", "ES", "HI", etc.
    private String context; // "GYM", "PET", "GENERAL", etc. - for specialized AI assistants
    private Map<String, Object> userContext; // Additional context like goals, plans, etc.
}
