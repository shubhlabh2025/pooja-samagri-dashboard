// features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthApi } from "../api/authApi";
import axiosClient from "@/api/apiClient";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

const authApi = createAuthApi(axiosClient);

interface AuthState {
  phoneNumber: string;
  isAuthenticated: boolean;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  phoneNumber: "",
  isAuthenticated: false,
  token: localStorage.getItem("accessToken") || null,
  status: "idle",
  error: null,
};

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      await authApi.sendOtp({ phone_number: phoneNumber });
      return phoneNumber;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message);

      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    { phoneNumber, otpCode }: { phoneNumber: string; otpCode: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.verifyOtp({
        phone_number: phoneNumber,
        otp_code: otpCode,
      });

      const { access_token, refresh_token } = response.data.data;

      // ✅ Save token to localStorage
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      return {
        phoneNumber,
        token: access_token,
      };
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message);

      return rejectWithValue(
        error.response?.data?.message || "Failed to verify OTP"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.phoneNumber = "";
      state.isAuthenticated = false;
      state.token = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.phoneNumber = action.payload;
        toast.success("Otp send on Your mobile");
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        toast.error("Otp failed to Send");
      })
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.phoneNumber = action.payload.phoneNumber;
        state.token = action.payload.token;
        toast.success("Otp Verified succesfully");
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        toast.error("Failed to verify Otp");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
