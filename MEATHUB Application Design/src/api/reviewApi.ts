// MEATHUB - Review API

import { apiClient } from './client';

export interface CreateReviewRequest {
  orderId: number;
  meatItemId: number;
  rating: number; // 1-5
  comment?: string;
}

export interface ReviewResponse {
  id: number;
  orderId: number;
  userId: number;
  userName?: string;
  butcherId: number;
  meatItemId: number;
  meatItemName?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export const reviewApi = {
  createReview: async (request: CreateReviewRequest): Promise<ReviewResponse> => {
    return apiClient.post<ReviewResponse>('/reviews', request);
  },

  getReviewsByMeatItem: async (meatItemId: number): Promise<ReviewResponse[]> => {
    return apiClient.get<ReviewResponse[]>(`/reviews/meat-item/${meatItemId}`);
  },

  getReviewsByButcher: async (butcherId: number): Promise<ReviewResponse[]> => {
    return apiClient.get<ReviewResponse[]>(`/reviews/butcher/${butcherId}`);
  },

  getMyReviews: async (): Promise<ReviewResponse[]> => {
    return apiClient.get<ReviewResponse[]>('/reviews/my');
  },
};

