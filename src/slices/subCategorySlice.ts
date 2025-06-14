// src/slices/subCategorySlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { SubCategories } from "@/interfaces/subcategories"; // or whatever your SubCategory type is
import type { GetCategoriesResponse } from "@/interfaces/GetAllCategoriesResponse";
import { createSubCategoryApi } from "../api/subCategoriesApi";
import axiosClient from "@/api/apiClient";

// API Instance
const subCategoryApi = createSubCategoryApi(axiosClient);

interface SubCategoryState {
  subCategories: SubCategories[];
  selectedSubCategory: SubCategories | null;
  pagination: GetCategoriesResponse["meta"] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SubCategoryState = {
  subCategories: [],
  selectedSubCategory: null,
  pagination: null,
  status: "idle",
  error: null,
};

// Async thunks

export const fetchSubCategories = createAsyncThunk(
  "subCategories/fetchAll",
  async (
    params: {
      page?: number;
      pageSize?: number;
      q?: string;
      parent_id?: string[];
    } = {}
  ) => {
    // Default to an empty array if not provided
    const parentIds = params.parent_id || [];
    const response = await subCategoryApi.getSubCategoriesById(parentIds);
    const { data, meta } = response.data;
    return { subCategories: data, pagination: meta };
  }
);

export const createSubCategory = createAsyncThunk(
  "subCategories/create",
  async (payload: any) => {
    const response = await subCategoryApi.createSubCategory(payload);
    return response.data.data;
  }
);

export const updateSubCategory = createAsyncThunk(
  "subCategories/update",
  async ({ id, updates }: { id: string; updates: any }) => {
    const response = await subCategoryApi.updateSubCategory(id, updates);
    return response.data.data;
  }
);

export const deleteSubCategory = createAsyncThunk(
  "subCategories/delete",
  async (id: string) => {
    await subCategoryApi.deleteSubCategory(id);
    return id;
  }
);

export const fetchSubCategoryById = createAsyncThunk(
  "subCategories/fetchById",
  async (id: string) => {
    const response = await subCategoryApi.getSubCategoryById(id);
    // If this returns a list, use the first item for selected
    const first = response.data.data || null;
    return first;
  }
);

// Slice

const subCategorySlice = createSlice({
  name: "subCategories",
  initialState,
  reducers: {
    clearSelectedSubCategory(state) {
      state.selectedSubCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subCategories = action.payload.subCategories;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch subcategories";
      })

      .addCase(fetchSubCategoryById.fulfilled, (state, action) => {
        state.selectedSubCategory = action.payload;
      })

      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.subCategories.push(action.payload);
      })

      .addCase(updateSubCategory.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.subCategories.findIndex((s) => s.id === updated.id);
        if (idx !== -1) state.subCategories[idx] = updated;
        if (state.selectedSubCategory?.id === updated.id) {
          state.selectedSubCategory = updated;
        }
      })

      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.subCategories = state.subCategories.filter(
          (s) => s.id !== action.payload
        );
      });
  },
});

export const { clearSelectedSubCategory } = subCategorySlice.actions;
export default subCategorySlice.reducer;
