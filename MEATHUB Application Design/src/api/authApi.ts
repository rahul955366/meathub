// MEATHUB - Authentication API
import { apiClient } from './client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: 'USER' | 'BUTCHER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', userData);
  },

  // Gmail OAuth - Coming soon
  googleAuth: async (googleToken: string): Promise<AuthResponse> => {
    // Will be implemented when backend is ready
    throw new Error('Gmail authentication coming soon');
  },
};

