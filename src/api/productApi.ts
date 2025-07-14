import type { AxiosInstance } from "axios";
import type { GetAllProductsResponse } from "@/interfaces/GetAllProductsResponse";
import type { Product, UpdateProductName } from "@/interfaces/product";
import type {
  CreateProductVariant,
  ProductVariant,
} from "@/interfaces/product-variant";

export const createProductApi = (client: AxiosInstance) => ({
  getAllProducts: (
    params: {
      page?: number;
      pageSize?: number;
      q?: string;
      category_id?: string;
    } = {},
  ) => {
    const { page = 1, pageSize = 30, q, category_id } = params;
    const query = [
      `page=${page}`,
      `limit=${pageSize}`,
      q ? `q=${encodeURIComponent(q)}` : "",
      category_id ? `category_id=${encodeURIComponent(category_id)}` : "",
    ]
      .filter(Boolean)
      .join("&");
    return client.get<GetAllProductsResponse>(`/api/products?${query}`);
  },
  getProductById: (id: string) => client.get<Product>(`/api/products/${id}`),

  deleteProduct: (id: string) => client.delete(`/api/products/${id}`),

  createProduct: (payload: { product_variants: CreateProductVariant[] }) =>
    client.post("/api/products/", payload), // type this later as per your schema

  updateProduct: (id: string, updates: ProductVariant) =>
    client.put<Product>(`/api/products/${id}`, updates),

  updateProductName: (id: string, updates: UpdateProductName) =>
    client.patch<Product>(`/api/products/${id}`, updates),
});
