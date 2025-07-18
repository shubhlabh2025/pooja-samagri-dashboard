import type { AxiosInstance } from "axios";
import type { GetCategoriesResponse } from "@/interfaces/GetAllCategoriesResponse";
import type { CategoryResponse } from "@/interfaces/CategoryResposne";
import type { CreateSubCategories } from "@/interfaces/subcategories";
import type { CreateCategoryPayload } from "@/interfaces/category";

export const createSubCategoryApi = (client: AxiosInstance) => ({
  getSubCategoriesById: (
    params: { page?: number; pageSize?: number; ids: string[] } // 'ids' is required and is string[]
  ) => {
    const parsedPage = Number(params.page);
    const parsedPageSize = Number(params.pageSize);

    const page = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const pageSize =
      !isNaN(parsedPageSize) && parsedPageSize > 0 ? parsedPageSize : 30;

    const queryParts = [`page=${page}`, `limit=${pageSize}`];

    if (params.ids && params.ids.length > 0) {
      queryParts.push(`parent_ids=${params.ids.join(",")}`);
    }

    const query = queryParts.join("&");
    console.log("my query");
    console.log(query);
    return client.get<GetCategoriesResponse>(`/api/sub-categories?${query}`);
  },

  getSubCategoryById: (id: string) =>
    client.get<CategoryResponse>(`/api/subCategories/${id}`),

  deleteSubCategory: (id: string) => client.delete(`/api/sub-categories/${id}`),

  createSubCategory: (payload: CreateSubCategories) =>
    client.post<CategoryResponse>("/api/sub-categories", payload), // type this later as per your schema

  updateSubCategory: (id: string, updates: CreateCategoryPayload) =>
    client.patch<CategoryResponse>(`/api/sub-categories/${id}`, updates),
});
