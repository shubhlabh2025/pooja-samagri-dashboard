import type { AxiosInstance } from "axios";
import type { Coupon, CreateCoupon, UpdateCoupon } from "@/interfaces/coupon";
import type { ApiResponse } from "@/interfaces/api-response";

export const createCouponApi = (client: AxiosInstance) => ({
  // GET /api/coupons?page=&limit=&q=
  getAllCoupons: (
    params: { page?: number; pageSize?: number; q?: string } = {},
  ) => {
    const { page = 1, pageSize = 30, q } = params;
    const query = [
      `page=${page}`,
      `limit=${pageSize}`,
      q ? `q=${encodeURIComponent(q)}` : "",
    ]
      .filter(Boolean)
      .join("&");

    return client.get<ApiResponse<Coupon[]>>(`/api/coupons?${query}`);
  },

  // GET /api/coupons/:id
  getCouponById: (id: string) =>
    client.get<ApiResponse<Coupon>>(`/api/coupons/${id}`),

  // POST /api/coupons
  createCoupon: (payload: CreateCoupon) =>
    client.post<Coupon>("/api/coupons", payload),

  // PUT /api/coupons/:id
  updateCoupon: (id: string, updates: UpdateCoupon) =>
    client.patch<Coupon>(`/api/coupons/${id}`, updates),

  // DELETE /api/coupons/:id
  deleteCouponById: (id: string) => client.delete(`/api/coupons/${id}`),

  // DELETE /api/coupons
  deleteAllCoupons: () => client.delete(`/api/coupons`),
});
