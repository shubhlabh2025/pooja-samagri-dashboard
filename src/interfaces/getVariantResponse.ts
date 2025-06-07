import type { ProductVariant } from "./product-variant";

export interface GetProductVariantResponse {
  success: boolean;
  message: string;
  data: ProductVariant;         // <-- Array of products
}