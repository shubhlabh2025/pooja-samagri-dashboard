// src/slices/configurationSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ConfigurationModel } from "@/interfaces/configurations";
import axiosClient from "@/api/apiClient";
import { createConfigurationApi } from "@/api/configurationApi";

const configurationApi = createConfigurationApi(axiosClient);

interface ConfigurationState {
  data: ConfigurationModel | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ConfigurationState = {
  data: null,
  status: "idle",
  error: null,
};

export const fetchConfiguration = createAsyncThunk(
  "configuration/fetchConfiguration",
  async () => {
    const response = await configurationApi.getConfiguration();
    return response.data.data;
  },
);

export const updateConfiguration = createAsyncThunk(
  "configuration/updateConfiguration",
  async (updates: Partial<ConfigurationModel>) => {
    const response = await configurationApi.updateConfiguration(updates);
    return response.data.data;
  },
);

const configurationSlice = createSlice({
  name: "configuration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfiguration.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConfiguration.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchConfiguration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch configuration";
      })
      .addCase(updateConfiguration.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateConfiguration.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateConfiguration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update configuration";
      });
  },
});

export default configurationSlice.reducer;
