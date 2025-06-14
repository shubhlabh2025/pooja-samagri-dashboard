import type { SubCategories } from "./subcategories";

export interface ProductVariant {
  id: string;
  product_id: string;
  display_label: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  categories?: SubCategories[];
  image: string[];
  brand_name: string;
  out_of_stock: boolean;
  default_variant: boolean;
  min_quantity?: number;
  max_quantity?: number;
  total_available_quantity: number;
  createdAt?: string;
  updatedAt?: string;
  category_ids?: string[];
  subcategory_ids?: string[];
}
export const defaultVariant = (): ProductVariant => ({
  id: "",
  product_id: "",
  display_label: "",
  name: "",
  description: "",
  mrp: 0,
  price: 0,
  categories: [],
  image: [],
  brand_name: "",
  out_of_stock: false,
  default_variant: false,
  min_quantity: 1,
  max_quantity: 1,
  total_available_quantity: 0,
  category_ids: [],
  subcategory_ids: [],
});

export interface CreateProductVariant {
  display_label: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  categories?: SubCategories[];
  image: string[];
  brand_name: string;
  out_of_stock: boolean;
  default_variant: boolean;
  min_quantity?: number;
  max_quantity?: number;
  total_available_quantity: number;
  category_ids?: string[];
  subcategory_ids?: string[];
}

export type UpdateProductVariantPayload = Partial<
  Omit<
    ProductVariant,
    "id" | "product_id" | "name" | "categories" | "createdAt" | "updatedAt"
  >
>;

export type CreateProductVariantPayload = Partial<
  Omit<ProductVariant, "id" | "categories" | "createdAt" | "updatedAt">
>;
