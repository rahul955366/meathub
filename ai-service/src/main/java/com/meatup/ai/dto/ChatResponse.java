package com.meatup.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String response;
    private String detectedIntent;
    private Object actionResult; // Optional result payload (e.g. order details)
}
