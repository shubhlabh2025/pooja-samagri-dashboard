import type { SubCategories } from "./subcategories";

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: SubCategories;
}
