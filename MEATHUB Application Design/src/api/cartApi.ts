// MEATHUB - Cart API (via API Gateway)
import { apiClient } from './client';

export interface CartItemResponse {
  id: number;
  meatItemId: number;
  butcherId: number;
  meatItemName: string;
  quantity: number;
  price: number;
  unit: string;
  subtotal: number;
}

export interface CartResponse {
  id: number;
  userId: number;
  items: CartItemResponse[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  meatItemId: number;
  butcherId: number;
  meatItemName: string;
  quantity: number;
  price: number;
  unit?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export const cartApi = {
  getCart: async (): Promise<CartResponse> => {
    return apiClient.get<CartResponse>('/cart');
  },

  addToCart: async (item: AddToCartRequest): Promise<CartResponse> => {
    // Ensure all required fields are present and valid
    const requestBody = {
      meatItemId: item.meatItemId,
      butcherId: item.butcherId,
      meatItemName: item.meatItemName,
      quantity: item.quantity || 1,
      price: item.price,
      unit: item.unit || 'KG',
    };
    
    // Validate required fields
    if (!requestBody.meatItemId || !requestBody.butcherId || !requestBody.meatItemName || !requestBody.price) {
      throw new Error('Missing required fields: meatItemId, butcherId, meatItemName, and price are required');
    }
    
    return apiClient.post<CartResponse>('/cart/add', requestBody);
  },

  updateItemQuantity: async (itemId: number, quantity: number): Promise<CartResponse> => {
    // Ensure quantity is sent as number (backend expects BigDecimal)
    return apiClient.put<CartResponse>(`/cart/item/${itemId}`, { quantity: Number(quantity) });
  },

  removeFromCart: async (itemId: number): Promise<void> => {
    return apiClient.delete<void>(`/cart/item/${itemId}`);
  },
  
  // Alias for backward compatibility
  removeItem: async (itemId: number): Promise<void> => {
    return apiClient.delete<void>(`/cart/item/${itemId}`);
  },

  clearCart: async (): Promise<void> => {
    // Backend doesn't have a clear endpoint, so we need to remove items individually
    // This method is kept for API consistency but should be handled in AppContext
    const cart = await this.getCart();
    for (const item of cart.items) {
      await this.removeFromCart(item.id);
    }
  },
};
