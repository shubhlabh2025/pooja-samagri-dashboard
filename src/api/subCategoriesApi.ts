import type { AxiosInstance } from "axios";
import type { GetCategoriesResponse } from "@/interfaces/GetAllCategoriesResponse";
import type { CategoryResponse } from "@/interfaces/CategoryResposne";
import type { CreateSubCategories } from "@/interfaces/subcategories";
import type { CreateCategoryPayload } from "@/interfaces/category";

export const createSubCategoryApi = (client: AxiosInstance) => ({
  getSubCategoriesById: (ids: string[]) =>
    client.get<GetCategoriesResponse>(`/api/sub-categories`, {
      params: { parent_ids: ids.join(",") },
    }),
  getSubCategoryById: (id: string) =>
    client.get<CategoryResponse>(`/api/subCategories/${id}`),

  deleteSubCategory: (id: string) => client.delete(`/api/sub-categories/${id}`),

  createSubCategory: (payload: CreateSubCategories) =>
    client.post<CategoryResponse>("/api/sub-categories", payload), // type this later as per your schema

  updateSubCategory: (id: string, updates: CreateCategoryPayload) =>
    client.patch<CategoryResponse>(`/api/sub-categories/${id}`, updates),
});
