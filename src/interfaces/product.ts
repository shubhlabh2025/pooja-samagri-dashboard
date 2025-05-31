import type { ProductVariant } from "./product-variant";

export interface Product {
  id: string;
  out_of_stock: boolean;
  default_variant_id: string;
  product_variants: ProductVariant[];
}
