import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Product, UpdateProductName } from "@/interfaces/product";
import type { PaginationMeta } from "@/interfaces/Pagination";
import { createProductApi } from "../api/productApi";
import axiosClient from "@/api/apiClient";
import type {
  CreateProductVariant,
  ProductVariant,
} from "@/interfaces/product-variant";
import { toast } from "react-toastify";

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  pagination: PaginationMeta | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  pagination: null,
  status: "idle",
  error: null,
};

const productApi = createProductApi(axiosClient);

// 🔹 1. Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (
    params: {
      page?: number;
      pageSize?: number;
      q?: string;
      category_id?: string;
    } = {},
  ) => {
    const response = await productApi.getAllProducts(params);
    const products = response.data.data; // Array<Product>
    const pagination = response.data.meta; // PaginationMeta
    return { products, pagination };
  },
);

// 🔹 2. Fetch product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string) => {
    const response = await productApi.getProductById(id);
    return response.data.data;
  },
);

// 🔹 3. Create a new product
export const createProduct = createAsyncThunk(
  "products/create",
  async (payload: { product_variants: CreateProductVariant[] }) => {
    const response = await productApi.createProduct(payload);
    return response.data;
  },
);

// 🔹 4. Update product by ID
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, updates }: { id: string; updates: ProductVariant }) => {
    const response = await productApi.updateProduct(id, updates);
    return response.data;
  },
);

export const updateProductName = createAsyncThunk(
  "products/updateName",
  async ({ id, updates }: { id: string; updates: UpdateProductName }) => {
    const response = await productApi.updateProductName(id, updates);
    return response.data;
  },
);

// 🔹 5. Delete product
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string) => {
    await productApi.deleteProduct(id);
    return id;
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
        toast.error(state.error);
      })

      // fetchById
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })

      // create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        toast.success("Product Created Successfully");
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to Create products";
        toast.error(state.error);
      })

      // update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.products.findIndex((p) => p.id === updated.id);
        if (index !== -1) state.products[index] = updated;
        if (state.selectedProduct?.id === updated.id) {
          state.selectedProduct = updated;
        }
        toast.success("Product Updated Successfully");
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to Update products";
        toast.error(state.error);
      })

      .addCase(updateProductName.fulfilled, (state, action) => {
        const updated = action.payload;
        // Update product in the list
        const index = state.products.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          // Only update the name field, keeping variants etc unchanged
          state.products[index].product_variants = state.products[
            index
          ].product_variants.map((v) => ({
            ...v,
            name: updated.product_variants[0]?.name ?? v.name,
          }));
        }
        // Also update in selectedProduct if needed
        if (state.selectedProduct?.id === updated.id) {
          state.selectedProduct = {
            ...state.selectedProduct,
            product_variants: state.selectedProduct.product_variants.map(
              (v) => ({
                ...v,
                name: updated.product_variants[0]?.name ?? v.name,
              }),
            ),
          };
        }
        toast.success("Product Updated Successfully");
      })

      // delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        toast.success("Product Deleted Successfully");
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
