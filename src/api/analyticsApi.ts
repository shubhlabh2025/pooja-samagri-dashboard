import type { AxiosInstance } from "axios";

export interface SalesSeriesPoint {
  date: string; // YYYY-MM-DD
  orders: number;
  revenue: number;
}

export interface SalesSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  series: SalesSeriesPoint[];
}

export interface TopCustomer {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string;
  email: string | null;
  order_count: number;
  total_spent: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AnalyticsRange {
  from: string; // YYYY-MM-DD or ISO
  to: string;
}

export const createAnalyticsApi = (client: AxiosInstance) => ({
  getSalesSummary: (range: AnalyticsRange) =>
    client.get<ApiResponse<SalesSummary>>("/api/analytics/sales-summary", {
      params: range,
    }),

  getTopCustomers: (range: AnalyticsRange & { limit?: number }) =>
    client.get<ApiResponse<TopCustomer[]>>("/api/analytics/top-customers", {
      params: range,
    }),
});
