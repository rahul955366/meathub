// MEATHUB - AI Assistant API Client

import { apiClient } from './client';

export interface ChatRequest {
  message: string;
  language?: string;
  context?: 'GYM' | 'PET' | 'GENERAL'; // Context for specialized AI assistants
  userContext?: {
    goal?: string;
    dailyProtein?: number;
    deliveryTime?: string;
    [key: string]: any;
  };
}

export interface ChatResponse {
  response?: string; // Backend uses 'response' field
  message?: string; // Frontend compatibility
  detectedIntent?: string;
  intent?: string; // Alias for detectedIntent
  actionResult?: any;
  language?: string;
}

/**
 * Helper function to get message content from ChatResponse
 */
export function getChatResponseMessage(response: ChatResponse): string {
  return response.message || response.response || '';
}

export const aiApi = {
  /**
   * Send a chat message to the AI assistant
   */
  chat: async (request: ChatRequest | string): Promise<ChatResponse> => {
    // Support both object and string for backward compatibility
    const chatRequest: ChatRequest = typeof request === 'string' 
      ? { message: request, language: 'en' }
      : request;
    return apiClient.post<ChatResponse>('/ai/chat', chatRequest);
  },

  /**
   * Get chat history for the current user
   */
  getChatHistory: async (): Promise<ChatResponse[]> => {
    // This endpoint would need to be added to backend
    return apiClient.get<ChatResponse[]>('/ai/history');
  },

  /**
   * 🥇 HIGH-IMPACT FEATURE: Get emotional narration for order status
   * Makes waiting feel shorter with human-language updates
   */
  narrateOrder: async (orderData: any): Promise<{ narration: string }> => {
    return apiClient.post<{ narration: string }>('/ai/orders/narrate', orderData);
  },

  /**
   * Explain delay in order delivery
   */
  explainDelay: async (orderData: any, reason: string): Promise<{ explanation: string }> => {
    return apiClient.post<{ explanation: string }>('/ai/orders/explain-delay', {
      order: orderData,
      reason
    });
  },
};
