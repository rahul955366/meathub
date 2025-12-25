// MEATHUB - Centralized API Client
// All API calls go through API Gateway at http://localhost:8000

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

// Direct service URLs (bypassing gateway for public endpoints with auth issues)
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8092';
const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8084';

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    return localStorage.getItem('meathub_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Bypass gateway for public endpoints with auth issues
    let baseUrl = this.baseURL;
    if (endpoint.startsWith('/ai/')) {
      baseUrl = AI_SERVICE_URL;
    } else if (endpoint.startsWith('/reviews/') && options.method === 'GET') {
      baseUrl = ORDER_SERVICE_URL;
    }

    const url = `${baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Clone response to read it multiple times if needed
      const responseClone = response.clone();

      // Always try to parse JSON for error responses
      let data: any;
      const contentType = response.headers.get('content-type');
      const isJsonResponse = contentType && contentType.includes('application/json');

      // For error responses or JSON responses, try to parse JSON
      if (!response.ok || isJsonResponse) {
        try {
          const text = await response.text();
          if (text && text.trim()) {
            try {
              data = JSON.parse(text);
            } catch (parseError) {
              // If JSON parsing fails, use text as message
              if (!response.ok) {
                const error: ApiError = {
                  message: text || response.statusText || `HTTP error! status: ${response.status}`,
                  status: response.status,
                };
                throw error;
              }
              data = {};
            }
          } else {
            data = {};
          }
        } catch (jsonError: any) {
          // If we already threw an error, re-throw it
          if (jsonError.status !== undefined) {
            throw jsonError;
          }
          // If response is not JSON, create error from status text
          if (!response.ok) {
            const error: ApiError = {
              message: response.statusText || `HTTP error! status: ${response.status}`,
              status: response.status,
            };
            throw error;
          }
          data = {};
        }
      } else {
        // For successful non-JSON responses, return empty object
        return {} as T;
      }

      if (!response.ok) {
        // Extract validation errors if present (Spring Boot format)
        let errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;

        // Only log errors in development, and only for non-network errors
        if (import.meta.env.DEV && response.status !== 0) {
          console.log('API Error Response:', {
            status: response.status,
            url: url,
            message: errorMessage
          });
        }

        if (data.errors && typeof data.errors === 'object') {
          const validationErrors = Object.entries(data.errors)
            .map(([field, messages]) => {
              const msg = Array.isArray(messages) ? messages.join(', ') : String(messages);
              return `${field}: ${msg}`;
            })
            .join('; ');
          if (validationErrors) {
            errorMessage = `Validation failed: ${validationErrors}`;
          }
        }

        const error: ApiError = {
          message: errorMessage,
          status: response.status,
          errors: data.errors,
        };

        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
          localStorage.removeItem('meathub_token');
          localStorage.removeItem('meathub_user');
          window.location.href = '/';
        }

        // Ensure error is properly thrown as ApiError
        const apiError = error as ApiError & Error;
        apiError.name = 'ApiError';
        throw apiError;
      }

      return data as T;
    } catch (error: any) {
      // If it's already an ApiError with status, re-throw it
      if (error && typeof error === 'object' && 'status' in error && error.status !== undefined) {
        throw error;
      }

      // Check if it's a fetch error (network error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: 'Network error: Unable to connect to server. Please check if the API gateway is running.',
          status: 0,
        } as ApiError;
      }

      // For other errors, preserve the message if available
      const errorMessage = error?.message || (error instanceof Error ? error.message : 'Network error');
      throw {
        message: errorMessage,
        status: error?.status || 0,
        errors: error?.errors,
      } as ApiError;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_GATEWAY_URL);

