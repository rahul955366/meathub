// MEATHUB - User Profile API
import { apiClient } from './client';

export interface UserProfileResponse {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  bio?: string;
  profileImageUrl?: string;
  gender?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileRequest {
  fullName: string;
  email: string;
  phone?: string;
  bio?: string;
  profileImageUrl?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface AddressResponse {
  id: number;
  addressType?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  landmark?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressRequest {
  addressType?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  landmark?: string;
  isDefault: boolean;
}

export const profileApi = {
  getProfile: async (): Promise<UserProfileResponse> => {
    return apiClient.get<UserProfileResponse>('/users/profile');
  },

  updateProfile: async (profile: UserProfileRequest): Promise<UserProfileResponse> => {
    return apiClient.put<UserProfileResponse>('/users/profile', profile);
  },

  getAddresses: async (): Promise<AddressResponse[]> => {
    return apiClient.get<AddressResponse[]>('/users/address');
  },

  createAddress: async (address: AddressRequest): Promise<AddressResponse> => {
    return apiClient.post<AddressResponse>('/users/address', address);
  },

  updateAddress: async (id: number, address: AddressRequest): Promise<AddressResponse> => {
    return apiClient.put<AddressResponse>(`/users/address/${id}`, address);
  },

  deleteAddress: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/users/address/${id}`);
  },
};

