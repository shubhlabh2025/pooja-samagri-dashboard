import type { ProductVariant } from "./product-variant";

export interface Product {
  id: string;
  createdAt: string;
  updatedAt: string;
  product_variants: ProductVariant[];
}

export interface UpdateProductName {
  name: string;
}
