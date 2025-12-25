// MEATHUB - Google OAuth API
import { apiClient } from './client';
import { AuthResponse } from './authApi';

export interface GoogleLoginRequest {
    token: string; // Google ID token
}

export const googleAuthApi = {
    loginWithGoogle: async (token: string): Promise<AuthResponse> => {
        return apiClient.post<AuthResponse>('/auth/google', { token });
    },
};
