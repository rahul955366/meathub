// MEATHUB - Media Service API
import { apiClient } from './client';

export interface MediaResponse {
  id: number;
  relatedType: string; // ORDER, MEAT_ITEM, COOKING
  relatedId: number;
  mediaType: string; // VIDEO, PHOTO
  mediaUrl: string;
  description?: string;
  dishName?: string;
  uploadedBy?: string;
  uploaderId?: number;
  createdAt: string;
}

export interface MediaUploadRequest {
  relatedType: string;
  relatedId: number;
  mediaType: string;
  mediaUrl: string;
  description?: string;
  dishName?: string;
}

export const mediaApi = {
  uploadMedia: async (request: MediaUploadRequest): Promise<MediaResponse> => {
    return apiClient.post<MediaResponse>('/media/upload', request);
  },

  getOrderMedia: async (orderId: number): Promise<MediaResponse[]> => {
    return apiClient.get<MediaResponse[]>(`/media/order/${orderId}`);
  },

  getMeatItemMedia: async (meatItemId: number): Promise<MediaResponse[]> => {
    return apiClient.get<MediaResponse[]>(`/media/meat-item/${meatItemId}`);
  },

  getCookingMedia: async (dishName: string): Promise<MediaResponse[]> => {
    return apiClient.get<MediaResponse[]>(`/media/cooking/${encodeURIComponent(dishName)}`);
  },

  // Admin endpoints
  getAllMedia: async (): Promise<MediaResponse[]> => {
    return apiClient.get<MediaResponse[]>('/admin/media');
  },

  deleteMedia: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/admin/media/${id}`);
  },
};

