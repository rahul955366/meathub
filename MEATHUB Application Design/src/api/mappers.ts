// MEATHUB - API Response Mappers
// Maps backend DTOs to frontend types

import { User, Address, Order, OrderItem, Subscription, MeatProduct, TrackingInfo, OrderStatus } from '../types';
import { AuthResponse } from './authApi';
import { UserProfileResponse, AddressResponse } from './profileApi';
import { OrderResponse } from './orderApi';
import { SubscriptionResponse } from './subscriptionApi';
import { MeatItemResponse } from './productApi';

// Map AuthResponse to User
export function mapAuthResponseToUser(authResponse: AuthResponse, addresses: AddressResponse[] = []): User {
  return {
    id: authResponse.id.toString(),
    name: authResponse.fullName,
    email: authResponse.email,
    phone: '', // Phone not in auth response, will be loaded from profile
    role: (authResponse.roles[0] || 'USER').toUpperCase() as 'USER' | 'BUTCHER' | 'ADMIN',
    addresses: addresses.map(mapAddressResponse),
    totalOrders: 0, // Will be loaded separately
    createdAt: new Date().toISOString(),
  };
}

// Map AddressResponse to Address
export function mapAddressResponse(addr: AddressResponse): Address {
  return {
    id: addr.id.toString(),
    line1: addr.addressLine1,
    line2: addr.addressLine2,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
    landmark: addr.landmark,
    isDefault: addr.isDefault,
  };
}

// Map OrderResponse to Order
export function mapOrderResponse(orderRes: OrderResponse, addresses: Address[] = []): Order {
  // Find delivery address or create a minimal one
  const deliveryAddr = addresses.find(a => 
    orderRes.deliveryAddress.includes(a.line1) || 
    orderRes.deliveryAddress.includes(a.city)
  ) || {
    id: 'temp',
    line1: orderRes.deliveryAddress,
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  };

  const statusMap: Record<string, OrderStatus> = {
    'PENDING': 'PLACED',
    'CONFIRMED': 'PLACED',
    'CUTTING': 'CUTTING',
    'PACKED': 'PACKED',
    'OUT_FOR_DELIVERY': 'OUT_FOR_DELIVERY',
    'DELIVERED': 'DELIVERED',
    'CANCELLED': 'CANCELLED',
  };

  const orderStatus = statusMap[orderRes.status] || 'PLACED';

  // Build tracking timeline
  const timeline = [
    {
      status: 'PLACED' as OrderStatus,
      timestamp: orderRes.createdAt,
      message: 'Order placed successfully',
      completed: true,
    },
    {
      status: 'CUTTING' as OrderStatus,
      timestamp: orderRes.confirmedAt || '',
      message: 'Your meat is being freshly cut',
      completed: ['CUTTING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(orderStatus),
    },
    {
      status: 'PACKED' as OrderStatus,
      timestamp: '',
      message: 'Order packed and ready',
      completed: ['PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(orderStatus),
    },
    {
      status: 'OUT_FOR_DELIVERY' as OrderStatus,
      timestamp: '',
      message: 'Out for delivery',
      completed: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(orderStatus),
    },
    {
      status: 'DELIVERED' as OrderStatus,
      timestamp: orderRes.deliveredAt || '',
      message: 'Delivered',
      completed: orderStatus === 'DELIVERED',
    },
  ];

  const trackingInfo: TrackingInfo = {
    currentStatus: orderStatus,
    timeline,
    estimatedArrival: orderRes.deliveredAt || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  };

  return {
    id: orderRes.id.toString(),
    userId: orderRes.userId.toString(),
    items: orderRes.items.map(item => ({
      productId: item.meatItemId?.toString() || item.id?.toString() || '',
      productName: item.meatItemName,
      cutType: '',
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
      imageUrl: '',
    })),
    totalAmount: orderRes.totalAmount,
    status: orderStatus,
    deliveryAddress: deliveryAddr,
    butcherId: orderRes.butcherId?.toString(),
    butcherName: orderRes.butcherBusinessName,
    orderDate: orderRes.createdAt,
    estimatedDelivery: orderRes.deliveredAt || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    actualDelivery: orderRes.deliveredAt,
    trackingInfo,
    videos: [],
  };
}

// Map SubscriptionResponse to Subscription
export function mapSubscriptionResponse(subRes: SubscriptionResponse, products: MeatProduct[] = []): Subscription {
  // Find product or create minimal one
  const product = products.find(p => p.id === subRes.meatItemId.toString()) || {
    id: subRes.meatItemId.toString(),
    name: subRes.meatItemName,
    category: 'CHICKEN' as const,
    cutType: '',
    description: '',
    price: subRes.subscriptionPrice || 0,
    unit: 'KG',
    imageUrl: '',
    inStock: true,
    tags: [],
  };

  const frequencyMap: Record<string, 'DAILY' | 'WEEKLY' | 'SUNDAY' | 'CUSTOM'> = {
    'WEEKLY': 'WEEKLY',
    'MONTHLY': 'WEEKLY', // Map monthly to weekly for display
    'YEARLY': 'WEEKLY', // Map yearly to weekly for display
    'DAILY': 'DAILY',
    'SUNDAY': 'SUNDAY',
    'CUSTOM': 'CUSTOM',
  };

  // Map active boolean to status
  const status = subRes.active ? 'ACTIVE' : 'PAUSED';

  // Map delivery days based on delivery option
  let deliveryDays: number[] = [0]; // Default to Sunday
  if (subRes.deliveryOption === 'WEDNESDAY_SUNDAY') {
    deliveryDays = [3, 0]; // Wednesday (3) and Sunday (0)
  } else if (subRes.deliveryOption === 'SUNDAY_ONLY') {
    deliveryDays = [0]; // Sunday only
  }

  return {
    id: subRes.id.toString(),
    userId: subRes.userId.toString(),
    productId: subRes.meatItemId.toString(),
    product,
    type: frequencyMap[subRes.period] || 'WEEKLY',
    quantity: subRes.quantityKg,
    startDate: subRes.createdAt,
    status: status as 'ACTIVE' | 'PAUSED' | 'CANCELLED',
    deliveryDays,
    nextDelivery: subRes.nextRunDate,
  };
}

// Map MeatItemResponse to MeatProduct
export function mapMeatItemToProduct(item: MeatItemResponse): MeatProduct {
  return {
    id: item.id.toString(),
    name: item.name,
    category: (item.category || 'CHICKEN').toUpperCase() as any,
    cutType: '',
    description: item.description || '',
    price: item.price,
    unit: 'KG',
    imageUrl: item.imageUrl || '',
    inStock: (item.quantity || 0) > 0,
    tags: [],
    butcherId: item.butcherId,
    butcherName: item.butcherName,
  };
}

