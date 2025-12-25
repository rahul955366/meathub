// MEATHUB - Butcher API Client

import { apiClient } from './client';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

export interface NearbyButcher {
  id: number;
  shopName: string;
  address: string;
  phoneNumber: string;
  description: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  isAvailable: boolean;
  status: string;
  rating?: number;
  totalRatings?: number;
}

export interface Butcher {
  id: number;
  userId: number;
  shopName: string;
  address: string;
  phoneNumber: string;
  description: string;
  status: string;
}

export interface ButcherProfile {
  id: number;
  userId: number;
  shopName: string;
  address: string;
  phoneNumber: string;
  description: string;
  status: string;
}

export interface ButcherResponse {
  id: number;
  userId: number;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  fssaiLicense?: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

export interface ApprovalRequest {
  reason: string;
}

export const butcherApi = {
  async getNearbyButchers(lat: number, lng: number, radius?: number): Promise<NearbyButcher[]> {
    const radiusParam = radius ? `&radius=${radius}` : '';
    return apiClient.get<NearbyButcher[]>(
      `/butchers/nearby?lat=${lat}&lng=${lng}${radiusParam}`
    );
  },

  async getButcherById(butcherId: number): Promise<Butcher> {
    return apiClient.get<Butcher>(`/butchers/${butcherId}`);
  },

  async getButcherItems(butcherId: number) {
    return apiClient.get(`/butchers/items/by-butcher/${butcherId}`);
  },

  async getMyProfile(): Promise<ButcherProfile> {
    return apiClient.get<ButcherProfile>('/butchers/me');
  },

  // Admin endpoints
  async getAllButchers(): Promise<ButcherResponse[]> {
    return apiClient.get<ButcherResponse[]>('/butchers/admin');
  },

  async approveButcher(butcherId: number): Promise<ButcherResponse> {
    return apiClient.put<ButcherResponse>(`/butchers/admin/${butcherId}/approve`, {});
  },

  async rejectButcher(butcherId: number, reason: string): Promise<ButcherResponse> {
    return apiClient.put<ButcherResponse>(`/butchers/admin/${butcherId}/reject`, { reason });
  },
};
