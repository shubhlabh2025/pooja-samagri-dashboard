import type { SubCategories } from "./categories";
import type { PaginationMeta } from "./Pagination";



export interface GetCategoriesResponse {
  success: boolean;
  message: string;
  data: SubCategories[];
  meta: PaginationMeta;
}