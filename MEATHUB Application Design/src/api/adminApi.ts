// MEATHUB - Admin Service API
import { apiClient } from './client';

export interface DashboardStatsResponse {
  totalUsers: number;
  totalButchers: number;
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
  pendingApprovals: number;
  todayOrders: number;
  todayRevenue: number;
}

export interface OrderSummaryResponse {
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  revenueByCategory: Record<string, number>;
}

export interface UserStatsResponse {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers: number;
}

export const adminApi = {
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    return apiClient.get<DashboardStatsResponse>('/admin/dashboard');
  },

  getOrderSummary: async (): Promise<OrderSummaryResponse> => {
    return apiClient.get<OrderSummaryResponse>('/admin/orders/summary');
  },

  getUserStats: async (): Promise<UserStatsResponse> => {
    return apiClient.get<UserStatsResponse>('/admin/users/stats');
  },
};

