import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createCategoryApi } from "../api/categoryApi"; // Adjust this import as per your file structure
import axiosClient from "@/api/apiClient";
import type { SubCategories } from "@/interfaces/subcategories";
import type { PaginationMeta } from "@/interfaces/Pagination";
import type { CreateCategoryPayload } from "@/interfaces/category";

// 1. API client instance
const categoryApi = createCategoryApi(axiosClient);

// 2. State interface
interface CategoryState {
  categories: SubCategories[];
  pagination: PaginationMeta | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  pagination: null,
  status: "idle",
  error: null,
};

// 3. Async thunks

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (params: { page?: number; pageSize?: number; q?: string } = {}) => {
    const response = await categoryApi.getAllCategories(params);
    const categories = response.data.data;
    const pagination = response.data.meta;
    return { categories, pagination };
  },
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (payload: CreateCategoryPayload) => {
    const response = await categoryApi.createCategory(payload);
    // you might want to return response.data.data if your API returns the new category
    return response.data.data as SubCategories;
  },
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, updates }: { id: string; updates: CreateCategoryPayload }) => {
    const response = await categoryApi.updateCategory(id, updates);
    return response.data; // this will now be Category type
  },
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: string) => {
    await categoryApi.deleteCategory(id);
    return id;
  },
);

// 4. Slice

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // add your local reducers here if needed
    clearCategories(state) {
      state.categories = [];
      state.pagination = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload.categories;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch categories";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload); // Add new category to top
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const index = state.categories.findIndex((c) => c.id === updated.id);
        if (index !== -1) state.categories[index] = updated;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload,
        );
      });
  },
});

export const { clearCategories } = categorySlice.actions;
export default categorySlice.reducer;
