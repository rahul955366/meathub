// MEATHUB - Gym API Client

import { apiClient } from './client';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

export type ProteinQuantity = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface GymPlan {
  id: number;
  userId: number;
  butcherId: number;
  meatItemId: number;
  meatItemName: string;
  dailyQuantityKg: ProteinQuantity;
  dailyQuantityGrams?: number; // Calculated from enum
  deliveryTime: string; // HH:mm format
  deliveryAddress: string;
  deliveryPhone: string;
  notes?: string;
  active: boolean;
  nextDeliveryDate?: string;
  createdAt?: string;
  updatedAt?: string;
  pausedAt?: string;
  lastExecutedAt?: string;
}

export interface CreateGymPlanRequest {
  butcherId: number;
  meatItemId: number;
  meatItemName: string;
  dailyQuantityKg: ProteinQuantity;
  deliveryTime?: string; // HH:mm format, defaults to 06:00
  deliveryAddress: string;
  deliveryPhone: string;
  notes?: string;
}

export const gymApi = {
  // Get my gym plans
  async getMyPlans(): Promise<GymPlan[]> {
    return apiClient.get<GymPlan[]>('/gym/my');
  },

  // Create gym plan
  async createPlan(request: CreateGymPlanRequest): Promise<GymPlan> {
    return apiClient.post<GymPlan>('/gym/subscribe', request);
  },

  // Pause plan
  async pausePlan(id: number): Promise<GymPlan> {
    return apiClient.put<GymPlan>(`/gym/${id}/pause`, {});
  },

  // Resume plan
  async resumePlan(id: number): Promise<GymPlan> {
    return apiClient.put<GymPlan>(`/gym/${id}/resume`, {});
  },
};

