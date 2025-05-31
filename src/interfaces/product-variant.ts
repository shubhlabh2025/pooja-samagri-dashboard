import type { Categories } from "./categories";

export interface ProductVariant {
  variant_id: string;
  product_id: string;
  display_label: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  categories?: Categories[];
  image: string[];
  brand_name: string;
  out_of_stock: boolean;
  min_quantity?: number;
  max_quantity?: number;
  total_available_quantity: number;
}
