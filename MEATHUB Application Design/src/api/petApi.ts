// MEATHUB - Pet API Client

import { apiClient } from './client';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

export interface PetProduct {
  id: number;
  butcherId: number;
  name: string;
  description?: string;
  type: 'RAW' | 'COOKED' | 'BONES' | 'ORGANS' | 'MIX'; // Backend uses 'type' not 'productType'
  pricePerKg: number;
  availableStockKg: number; // Backend uses 'availableStockKg' not 'stockQuantityKg'
  isAvailable: boolean;
  imageUrl?: string;
  createdAt?: string;
}

export interface PetSubscription {
  id: number;
  userId: number;
  petType: 'DOG' | 'CAT' | 'BIRD' | 'OTHER';
  productId: number;
  productName?: string;
  quantityKg: number;
  scheduleType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  deliveryAddress: string;
  active: boolean;
  nextDeliveryDate?: string;
  createdAt?: string;
  updatedAt?: string;
  pausedAt?: string;
  lastExecutedAt?: string;
}

export interface PetSubscriptionRequest {
  petType: 'DOG' | 'CAT' | 'BIRD' | 'OTHER';
  productId: number;
  quantityKg: number;
  scheduleType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  deliveryAddress: string;
}

export const petApi = {
  // Get all available pet products
  async getProducts(): Promise<PetProduct[]> {
    return apiClient.get<PetProduct[]>('/pet/products');
  },

  // Get my pet subscriptions
  async getMySubscriptions(): Promise<PetSubscription[]> {
    return apiClient.get<PetSubscription[]>('/pet/my');
  },

  // Create pet subscription
  async subscribe(request: PetSubscriptionRequest): Promise<PetSubscription> {
    return apiClient.post<PetSubscription>('/pet/subscribe', request);
  },

  // Pause subscription
  async pauseSubscription(id: number): Promise<PetSubscription> {
    return apiClient.put<PetSubscription>(`/pet/${id}/pause`, {});
  },

  // Resume subscription
  async resumeSubscription(id: number): Promise<PetSubscription> {
    return apiClient.put<PetSubscription>(`/pet/${id}/resume`, {});
  },
};

