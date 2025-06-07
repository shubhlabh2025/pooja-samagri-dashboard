import type { AxiosInstance } from "axios";
import type { GetCategoriesResponse } from "@/interfaces/GetAllCategoriesResponse";
import type { CategoryResponse } from "@/interfaces/CategoryResposne";

export const createSubCategoryApi = (client: AxiosInstance) => ({
  getSubCategoriesById: (ids: string[]) =>
    client.get<GetCategoriesResponse>(`/api/sub-categories`, {
      params: { parent_ids: ids.join(",") },
    }),
  getSubCategoryById: (id: string) =>
    client.get<CategoryResponse>(`/api/subCategories/${id}`),

  deleteSubCategory: (id: string) => client.delete(`/api/sub-categories/${id}`),

  createSubCategory: (payload: any) =>
    client.post<CategoryResponse>("/api/sub-categories", payload), // type this later as per your schema

  updateSubCategory: (id: string, updates: any) =>
    client.patch<CategoryResponse>(`/api/sub-categories/${id}`, updates),
});
