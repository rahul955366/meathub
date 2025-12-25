// MEATHUB - Centralized Error Handler

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export function getErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Please login to continue.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This action conflicts with existing data.';
      case 422:
        return 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
}

export function isNetworkError(error: any): boolean {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('Network') ||
         !navigator.onLine;
}

export function handleError(error: any, defaultMessage?: string): string {
  const message = getErrorMessage(error);
  
  if (isNetworkError(error)) {
    return 'Network error. Please check your internet connection.';
  }

  return message || defaultMessage || 'An unexpected error occurred.';
}

