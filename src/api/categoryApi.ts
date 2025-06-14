import type { AxiosInstance } from "axios";
import type { GetCategoriesResponse } from "@/interfaces/GetAllCategoriesResponse";
import type { CategoryResponse } from "@/interfaces/CategoryResposne";
import type { ApiResponse } from "@/interfaces/api-response";

export const createCategoryApi = (client: AxiosInstance) => ({
  getAllCategories: (
    params: { page?: number; pageSize?: number; q?: string } = {}
  ) => {
    const { page = 1, pageSize = 30, q } = params;
    const query = [
      `page=${page}`,
      `limit=${pageSize}`,
      q ? `q=${encodeURIComponent(q)}` : "",
      `sort_by=priority`,
      `sort_order=DESC`
    ]
      .filter(Boolean)
      .join("&");
    return client.get<GetCategoriesResponse>(`/api/categories?${query}`);
  },

  deleteCategory: (id: string) => client.delete(`/api/categories/${id}`),

  createCategory: (payload: any) =>
    client.post<CategoryResponse>("/api/categories", payload), // type this later as per your schema

  updateCategory: (id: string, updates: any) =>
    client.patch<CategoryResponse>(`/api/categories/${id}`, updates),
});
