import type { AxiosInstance } from "axios";
import type { ApiResponse } from "@/interfaces/api-response";
import type { AllOrderDetail, Order, updateStatus } from "@/interfaces/orders";

export const createOrderApi = (client: AxiosInstance) => ({
  // GET /api/orders/all?page=&limit=&order_number=
  getAllOrders: (
    params: {
      page?: number;
      pageSize?: number;
      status?: string;
      order_number?: string;
      phone_number?: string;
    } = {},
  ) => {
    const {
      page = 1,
      pageSize = 30,
      status,
      order_number,
      phone_number,
    } = params;
    const query: string[] = [];

    if (page) query.push(`page=${page}`);
    if (pageSize) query.push(`limit=${pageSize}`);
    if (status) query.push(`status=${encodeURIComponent(status)}`);
    if (order_number)
      query.push(`order_number=${encodeURIComponent(order_number)}`);
    if (phone_number)
      query.push(`phone_number=${encodeURIComponent(phone_number)}`);

    const queryString = query.length > 0 ? `?${query.join("&")}` : "";

    return client.get<ApiResponse<Order[]>>(`/api/orders/all${queryString}`);
  },

  // GET /api/orders/:id
  getOrderById: (id: string) =>
    client.get<ApiResponse<AllOrderDetail>>(`/api/orders/${id}`),

  downloadInvoice: (id: string) =>
    client.get(`/api/orders/${id}/invoice`, {
      responseType: "blob", // Important: tells axios to expect binary data
    }),

  updateOrderStatus: (id: string, status: string, comment: string) => {
    return client.patch<updateStatus>(`/api/orders/${id}/status`, {
      status,
      comment,
    });
  },
});
