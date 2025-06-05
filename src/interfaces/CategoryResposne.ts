import type { SubCategories } from "./categories";

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: SubCategories;
}