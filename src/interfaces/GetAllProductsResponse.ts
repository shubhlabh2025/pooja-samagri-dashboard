import type { PaginationMeta } from "./Pagination";
import type { Product } from "./product";

export interface GetAllProductsResponse {
  success: boolean;
  message: string;
  data: Product[];         // <-- Array of products
  meta: PaginationMeta;    // <-- Pagination info
}