// MEATHUB - Product API (Meat Items from Butcher Service)
import { apiClient } from './client';
import { MeatProduct } from '../types';

export interface MeatItemResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl: string;
  butcherName?: string;
  butcherId?: number;
}

export interface MeatItemRequest {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string;
}

export const productApi = {
  // Get all available meat items (across all butchers) with optional filters
  getAvailableItems: async (filters?: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    butcherId?: number;
  }): Promise<MeatItemResponse[]> => {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.butcherId) params.append('butcherId', filters.butcherId.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/butchers/items/available?${queryString}` : '/butchers/items/available';
    return apiClient.get<MeatItemResponse[]>(url);
  },

  // Get items by butcher
  getItemsByButcher: async (butcherId: number): Promise<MeatItemResponse[]> => {
    return apiClient.get<MeatItemResponse[]>(`/butchers/items/by-butcher/${butcherId}`);
  },

  // Get my items (butcher only)
  getMyItems: async (): Promise<MeatItemResponse[]> => {
    return apiClient.get<MeatItemResponse[]>('/butchers/items/my');
  },

  // Create meat item (butcher only)
  createItem: async (item: MeatItemRequest): Promise<MeatItemResponse> => {
    return apiClient.post<MeatItemResponse>('/butchers/items', item);
  },

  // Update meat item (butcher only)
  updateItem: async (id: number, item: MeatItemRequest): Promise<MeatItemResponse> => {
    return apiClient.put<MeatItemResponse>(`/butchers/items/${id}`, item);
  },

  // Delete meat item (butcher only)
  deleteItem: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/butchers/items/${id}`);
  },
};

