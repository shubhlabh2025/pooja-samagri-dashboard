import type { AxiosInstance } from "axios";
import type { GetCategoriesResponse } from "@/interfaces/GetAllCategoriesResponse";
import type { CategoryResponse } from "@/interfaces/CategoryResposne";
import type { CreateCategoryPayload } from "@/interfaces/category";

export const createCategoryApi = (client: AxiosInstance) => ({
  getAllCategories: (
    params: { page?: number; pageSize?: number; q?: string } = {},
  ) => {
    const { page = 1, pageSize = 30, q } = params;
    const query = [
      `page=${page}`,
      `limit=${pageSize}`,
      q ? `q=${encodeURIComponent(q)}` : "",
      `sort_by=priority`,
      `sort_order=DESC`,
    ]
      .filter(Boolean)
      .join("&");
    return client.get<GetCategoriesResponse>(`/api/categories?${query}`);
  },

  deleteCategory: (id: string) => client.delete(`/api/categories/${id}`),

  createCategory: (payload: CreateCategoryPayload) =>
    client.post<CategoryResponse>("/api/categories", payload), // type this later as per your schema

  updateCategory: (id: string, updates: CreateCategoryPayload) =>
    client.patch<CategoryResponse>(`/api/categories/${id}`, updates),
});
