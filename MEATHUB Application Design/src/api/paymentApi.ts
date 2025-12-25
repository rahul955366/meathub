// MEATHUB - Payment API
// Handles payment gateway integration (Razorpay)

import { apiClient } from './client';

export interface CreatePaymentRequest {
  amount: number; // in rupees
  currency?: string;
  orderId?: string; // MEATHUB order ID (optional, for linking)
  subscriptionId?: string; // MEATHUB subscription ID (optional)
  description?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface PaymentResponse {
  paymentId: string;
  orderId: string; // Razorpay order ID
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId?: string; // MEATHUB order ID
  subscriptionId?: string; // MEATHUB subscription ID
}

export interface VerifyPaymentResponse {
  verified: boolean;
  orderId?: string;
  subscriptionId?: string;
  message: string;
}

export const paymentApi = {
  /**
   * Create a payment order with Razorpay
   * Returns Razorpay order details for frontend checkout
   */
  createPayment: async (request: CreatePaymentRequest): Promise<PaymentResponse> => {
    return apiClient.post<PaymentResponse>('/payments/create', request);
  },

  /**
   * Verify payment after Razorpay callback
   * Verifies Razorpay signature and confirms payment
   */
  verifyPayment: async (request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> => {
    return apiClient.post<VerifyPaymentResponse>('/payments/verify', request);
  },

  /**
   * Get payment status
   */
  getPaymentStatus: async (paymentId: string): Promise<PaymentResponse> => {
    return apiClient.get<PaymentResponse>(`/payments/${paymentId}`);
  },

  /**
   * Refund a payment
   */
  refundPayment: async (paymentId: string, amount?: number): Promise<PaymentResponse> => {
    return apiClient.post<PaymentResponse>(`/payments/${paymentId}/refund`, { amount });
  },
};

