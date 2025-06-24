// slices/productVariantSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  CreateProductVariantPayload,
  ProductVariant,
  UpdateProductVariantPayload,
} from "@/interfaces/product-variant";
import { createProductVariantApi } from "../api/productVariantApi"; // adjust path as needed
import axiosClient from "@/api/apiClient";

interface ProductVariantState {
  variants: ProductVariant[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductVariantState = {
  variants: [],
  status: "idle",
  error: null,
};

const variantApi = createProductVariantApi(axiosClient);

// --- Thunks ---

export const createProductVariant = createAsyncThunk(
  "productVariant/create",
  async (payload: CreateProductVariantPayload) => {
    const response = await variantApi.createProductVariant(payload);
    return response.data.data;
  },
);

// API expects only updatable fields (not id/product_id/name)

// update thunk:
export const updateProductVariant = createAsyncThunk(
  "productVariant/update",
  async ({
    id,
    updates,
  }: {
    id: string;
    updates: UpdateProductVariantPayload;
  }) => {
    const response = await variantApi.updateProductVariant(id, updates);
    return response.data;
  },
);

export const deleteProductVariant = createAsyncThunk(
  "productVariant/delete",
  async (id: string) => {
    await variantApi.deleteProductVariant(id);
    return id;
  },
);

// --- Slice ---
const productVariantSlice = createSlice({
  name: "productVariant",
  initialState,
  reducers: {
    clearVariants(state) {
      state.variants = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createProductVariant.fulfilled, (state, action) => {
        // assuming backend returns new variant or all
        // If all, set state.variants = action.payload
        // If one, push to array
        if (Array.isArray(action.payload)) {
          state.variants = action.payload;
        } else {
          state.variants.push(action.payload);
        }
      })
      .addCase(updateProductVariant.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.variants.findIndex((v) => v.id === updated.id);
        if (index !== -1) state.variants[index] = updated;
      })
      .addCase(deleteProductVariant.fulfilled, (state, action) => {
        state.variants = state.variants.filter((v) => v.id !== action.payload);
      });
  },
});

export const { clearVariants } = productVariantSlice.actions;
export default productVariantSlice.reducer;
