// MEATHUB - Subscription API
import { apiClient } from './client';

export interface SubscriptionResponse {
  id: number;
  userId: number;
  butcherId: number;
  meatItemId: number;
  meatItemName: string;
  quantityKg: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  deliveryOption: 'WEDNESDAY_SUNDAY' | 'SUNDAY_ONLY';
  primaryDayOfWeek?: string;
  secondaryDayOfWeek?: string;
  deliveryTime?: string;
  isSundaySpecial: boolean;
  active: boolean;
  nextRunDate: string;
  deliveryAddress: string;
  deliveryPhone: string;
  subscriptionPrice: number;
  notifyIfNotHome: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  pausedAt?: string;
  lastExecutedAt?: string;
}

export interface CreateSubscriptionRequest {
  butcherId: number;
  meatItemId: number;
  meatItemName: string;
  quantityKg: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  deliveryOption: 'WEDNESDAY_SUNDAY' | 'SUNDAY_ONLY';
  deliveryTime?: string | null;
  isSundaySpecial: boolean;
  deliveryAddress: string;
  deliveryPhone: string;
  subscriptionPrice: number;
  notifyIfNotHome: boolean;
  notes?: string;
}

export const subscriptionApi = {
  createSubscription: async (request: CreateSubscriptionRequest): Promise<SubscriptionResponse> => {
    return apiClient.post<SubscriptionResponse>('/subscriptions', request);
  },

  getMySubscriptions: async (): Promise<SubscriptionResponse[]> => {
    return apiClient.get<SubscriptionResponse[]>('/subscriptions/my');
  },

  pauseSubscription: async (id: number): Promise<SubscriptionResponse> => {
    return apiClient.put<SubscriptionResponse>(`/subscriptions/${id}/pause`, {});
  },

  resumeSubscription: async (id: number): Promise<SubscriptionResponse> => {
    return apiClient.put<SubscriptionResponse>(`/subscriptions/${id}/resume`, {});
  },

  // Butcher endpoints
  getButcherSubscriptions: async (): Promise<SubscriptionResponse[]> => {
    return apiClient.get<SubscriptionResponse[]>('/butcher/subscriptions');
  },

  // Admin endpoints
  getAllSubscriptions: async (): Promise<SubscriptionResponse[]> => {
    return apiClient.get<SubscriptionResponse[]>('/admin/subscriptions');
  },
};

