// MEATHUB - Order API
import { apiClient } from './client';

export interface OrderItemResponse {
  id?: number;
  meatItemId: number;
  meatItemName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  userId: number;
  butcherId: number;
  butcherBusinessName?: string;
  items: OrderItemResponse[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CUTTING' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  deliveryAddress: string;
  deliveryPhone: string;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  deliveredAt?: string;
}

export interface PlaceOrderRequest {
  butcherId: number;
  deliveryAddress: string;
  deliveryPhone: string;
  notes?: string;
}

export interface CancelOrderRequest {
  reason: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export const orderApi = {
  placeOrder: async (request: PlaceOrderRequest): Promise<OrderResponse> => {
    return apiClient.post<OrderResponse>('/orders/place', request);
  },

  getMyOrders: async (): Promise<OrderResponse[]> => {
    return apiClient.get<OrderResponse[]>('/orders/my');
  },

  getOrderById: async (orderId: number): Promise<OrderResponse> => {
    const orders = await apiClient.get<OrderResponse[]>('/orders/my');
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  },

  cancelOrder: async (orderId: number, reason: string): Promise<OrderResponse> => {
    return apiClient.put<OrderResponse>(`/orders/${orderId}/cancel`, { reason });
  },

  // Butcher endpoints
  getButcherOrders: async (): Promise<OrderResponse[]> => {
    return apiClient.get<OrderResponse[]>('/butcher/orders');
  },

  updateOrderStatus: async (orderId: number, status: string): Promise<OrderResponse> => {
    return apiClient.put<OrderResponse>(`/butcher/orders/${orderId}/status`, { status });
  },

  // Admin endpoints
  getAllOrders: async (): Promise<OrderResponse[]> => {
    return apiClient.get<OrderResponse[]>('/admin/orders');
  },
};

