import type { AxiosInstance } from "axios";
import type { GetCategoriesResponse } from "@/interfaces/GetAllCategoriesResponse";
import type { CategoryResponse } from "@/interfaces/CategoryResposne";

export const createSubCategoryApi = (client: AxiosInstance) => ({
  getSubCategoriesById: (id: string) =>
    client.get<GetCategoriesResponse>(
      `/api/subCategories/subCategoryList/${id}`
    ),
  getSubCategoryById: (id: string) =>
    client.get<CategoryResponse>(`/api/subCategories/${id}`),

  deleteSubCategory: (id: string) => client.delete(`/api/subCategories/${id}`),

  createSubCategory: (payload: any) =>
    client.post<CategoryResponse>("/api/subCategories", payload), // type this later as per your schema

  updateSubCategory: (id: string, updates: any) =>
    client.patch<CategoryResponse>(`/api/subCategories/${id}`, updates),
});
