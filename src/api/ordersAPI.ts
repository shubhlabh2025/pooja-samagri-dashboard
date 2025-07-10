import type { AxiosInstance } from "axios";
import type { ApiResponse } from "@/interfaces/api-response";
import type { Order, updateStatus } from "@/interfaces/orders";

export const createOrderApi = (client: AxiosInstance) => ({
  // GET /api/orders/all?page=&limit=&order_number=
  getAllOrders: (
    params: {
      page?: number;
      pageSize?: number;
      status?: string;
      order_number?: string;
    } = {}
  ) => {
    const { page = 1, pageSize = 30, status, order_number } = params;
    const query: string[] = [];

    if (page) query.push(`page=${page}`);
    if (pageSize) query.push(`limit=${pageSize}`);
    if (status) query.push(`status=${encodeURIComponent(status)}`);
    if (order_number)
      query.push(`order_number=${encodeURIComponent(order_number)}`);

    const queryString = query.length > 0 ? `?${query.join("&")}` : "";

    return client.get<ApiResponse<Order[]>>(`/api/orders/all${queryString}`);
  },

  // GET /api/orders/:id
  getOrderById: (id: string) =>
    client.get<ApiResponse<Order>>(`/api/orders/${id}`),

  updateOrderStatus: (id: string, status: string) => {
    return client.patch<updateStatus>(`/api/orders/${id}/status`, {
      status,
    });
  },
});
