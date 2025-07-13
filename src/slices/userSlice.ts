import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "@/interfaces/user";
import type { ApiResponse } from "@/interfaces/api-response";
import axiosClient from "@/api/apiClient";
import { createUserApi } from "@/api/userApi";
import type { RootState } from "@/store";

// --- API instance ---
const userApi = createUserApi(axiosClient);

// --- State Interface ---
interface UserState {
  users: User[];
  pagination: ApiResponse<User[]>["meta"] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// --- Initial State ---
const initialState: UserState = {
  users: [],
  pagination: null,
  status: "idle",
  error: null,
};

// --- Thunks ---
export const fetchUsers = createAsyncThunk<
  { users: User[]; pagination: ApiResponse<User[]>["meta"] },
  { page?: number; pageSize?: number; phone_number?: string } | undefined,
  { rejectValue: string }
>("users/fetchAll", async (params = {}, thunkAPI) => {
  try {
    const response = await userApi.getAllUsers(params);
    const { data, meta } = response.data;
    return { users: data, pagination: meta };
  } catch (error) {
    return thunkAPI.rejectWithValue("Failed to fetch users " + error);
  }
});

// --- Slice ---
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsers(state) {
      state.users = [];
      state.pagination = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });
  },
});

// --- Selectors ---
export const selectUsers = (state: RootState) => state.user.users;
export const selectUserPagination = (state: RootState) => state.user.pagination;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;

// --- Exports ---
export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;
