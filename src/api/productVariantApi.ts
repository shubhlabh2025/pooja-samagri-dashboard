import type { AxiosInstance } from "axios";
import type {
  CreateProductVariantPayload,
  ProductVariant,
  UpdateProductVariantPayload,
} from "@/interfaces/product-variant";
import type { GetProductVariantResponse } from "@/interfaces/getVariantResponse";

export const createProductVariantApi = (client: AxiosInstance) => ({
  createProductVariant: (payload: CreateProductVariantPayload) =>
    client.post<GetProductVariantResponse>("/api/variants/", payload), // type this later as per your schema

  updateProductVariant: (id: string, updates: UpdateProductVariantPayload) =>
    client.patch<ProductVariant>(`/api/variants/${id}`, updates),

  deleteProductVariant: (id: string) => client.delete(`/api/variants/${id}`),
});
