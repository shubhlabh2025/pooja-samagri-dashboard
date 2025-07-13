import type { AxiosInstance } from "axios";
import type { ApiResponse } from "@/interfaces/api-response";
import type { User } from "@/interfaces/user";

export const createUserApi = (client: AxiosInstance) => ({
  getAllUsers: (
    params: {
      page?: number;
      pageSize?: number;
      phone_number?: string;
    } = {},
  ) => {
    const { page = 1, pageSize = 30, phone_number } = params;
    const query: string[] = [];

    if (page) query.push(`page=${page}`);
    if (pageSize) query.push(`limit=${pageSize}`);
    if (phone_number)
      query.push(`phone_number=${encodeURIComponent(phone_number)}`);

    const queryString = query.length > 0 ? `?${query.join("&")}` : "";

    return client.get<ApiResponse<User[]>>(`/api/users/all${queryString}`);
  },
});
