// MEATHUB - Production Type Definitions
// Maps to 14 microservices + API Gateway backend

export type UserRole = 'USER' | 'BUTCHER' | 'ADMIN';

export type OrderStatus = 
  | 'PLACED' 
  | 'CUTTING' 
  | 'PACKED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type SubscriptionType = 
  | 'DAILY' 
  | 'WEEKLY' 
  | 'SUNDAY' 
  | 'CUSTOM';

export type MeatCategory = 
  | 'CHICKEN' 
  | 'MUTTON' 
  | 'FISH' 
  | 'PRAWNS' 
  | 'MARINATED' 
  | 'GYM' 
  | 'PET' 
  | 'B2B';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  addresses: Address[];
  totalOrders: number;
  createdAt: string;
  isApproved?: boolean; // For butchers
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface MeatProduct {
  id: string;
  name: string;
  category: MeatCategory;
  cutType: string;
  description: string;
  price: number; // per kg
  unit: string;
  imageUrl: string;
  inStock: boolean;
  nutritionInfo?: NutritionInfo;
  tags: string[];
  isMarinated?: boolean;
  marinationType?: string;
  butcherId?: number; // ID of the butcher this product belongs to
  butcherName?: string; // Name of the butcher shop
}

export interface NutritionInfo {
  protein: number;
  fat: number;
  calories: number;
  carbs: number;
}

export interface CartItem {
  product: MeatProduct;
  quantity: number; // in kg or units
  specialInstructions?: string;
  butcherId?: number; // ID of the butcher this item belongs to
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: Address;
  butcherId?: string;
  butcherName?: string;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  trackingInfo: TrackingInfo;
  videos: OrderVideo[];
  invoiceUrl?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  cutType: string;
  quantity: number;
  price: number;
  subtotal: number;
  imageUrl: string;
}

export interface TrackingInfo {
  currentStatus: OrderStatus;
  timeline: TrackingEvent[];
  estimatedArrival: string;
  deliveryPersonName?: string;
  deliveryPersonPhone?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface TrackingEvent {
  status: OrderStatus;
  timestamp: string;
  message: string;
  completed: boolean;
}

export interface OrderVideo {
  id: string;
  orderId: string;
  type: 'CUTTING' | 'PACKING';
  videoUrl: string;
  thumbnailUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  product: MeatProduct;
  type: SubscriptionType;
  quantity: number;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  deliveryDays: number[]; // 0-6, Sunday = 0
  pausedUntil?: string;
  nextDelivery: string;
}

export interface ButcherStats {
  totalOrders: number;
  todayOrders: number;
  weeklyOrders: number;
  monthlyOrders: number;
  revenue: {
    today: number;
    week: number;
    month: number;
  };
  averageRating: number;
  totalReviews: number;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalButchers: number;
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
  pendingApprovals: number;
  todayOrders: number;
  todayRevenue: number;
  ordersByStatus: Record<OrderStatus, number>;
  revenueByCategory: Record<MeatCategory, number>;
  topProducts: Array<{
    product: MeatProduct;
    totalSold: number;
    revenue: number;
  }>;
}

export interface AIAssistantMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  timestamp: string;
  action?: AIAction;
}

export interface AIAction {
  type: 'ORDER_PLACED' | 'ORDER_CANCELLED' | 'TRACKING_UPDATE' | 'RECIPE_SUGGESTION' | 'SUBSCRIPTION_UPDATED';
  data?: any;
  success: boolean;
}

export interface GymPlan {
  id: string;
  name: string;
  description: string;
  dailyProtein: number;
  products: Array<{
    product: MeatProduct;
    quantity: number;
  }>;
  price: number;
  duration: number; // in days
}

export interface PetProduct extends MeatProduct {
  petType: 'DOG' | 'CAT' | 'BIRD';
  preparationType: 'RAW' | 'COOKED';
}

export interface B2BOrder extends Order {
  businessName: string;
  businessType: 'RESTAURANT' | 'HOSTEL' | 'PG' | 'HOTEL' | 'OTHER';
  gstNumber?: string;
  bulkDiscount: number;
}
