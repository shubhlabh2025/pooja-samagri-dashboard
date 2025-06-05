import type { AxiosInstance } from "axios";
import type { ProductVariant } from "@/interfaces/product-variant";

export const createProductVariantApi = (client: AxiosInstance) => ({


  deleteProductVariant: (id: string) => client.delete(`/api/variants/${id}`),

  createProductVariant: (payload: { product_variants: ProductVariant }) =>
    client.post("/api/variants/", payload), // type this later as per your schema

  updateProductVariant: (id: string, updates: ProductVariant) =>
    client.put<ProductVariant>(`/api/variants/${id}`, updates),

});
