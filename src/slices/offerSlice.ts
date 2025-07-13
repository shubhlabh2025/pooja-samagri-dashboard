import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { Coupon, CreateCoupon, UpdateCoupon } from "@/interfaces/coupon";
import { createCouponApi } from "@/api/offersApis";
import axiosClient from "@/api/apiClient";
import { toast } from "react-toastify";

const couponApi = createCouponApi(axiosClient);

// Thunks
export const fetchCoupons = createAsyncThunk(
  "coupons/fetchAll",
  async (params?: { page?: number; pageSize?: number; q?: string }) => {
    const res = await couponApi.getAllCoupons(params);
    return res.data.data;
  },
);

export const fetchCouponById = createAsyncThunk(
  "coupons/fetchById",
  async (id: string) => {
    const res = await couponApi.getCouponById(id);
    return res.data.data;
  },
);

export const createCoupon = createAsyncThunk(
  "coupons/create",
  async (data: CreateCoupon) => {
    const res = await couponApi.createCoupon(data);
    return res.data;
  },
);

export const updateCoupon = createAsyncThunk(
  "coupons/update",
  async ({ id, updates }: { id: string; updates: UpdateCoupon }) => {
    const res = await couponApi.updateCoupon(id, updates);
    return res.data;
  },
);

export const deleteCouponById = createAsyncThunk(
  "coupons/deleteById",
  async (id: string) => {
    await couponApi.deleteCouponById(id);
    return id;
  },
);

export const deleteAllCoupons = createAsyncThunk(
  "coupons/deleteAll",
  async () => {
    await couponApi.deleteAllCoupons();
    return;
  },
);

// Slice
interface CouponState {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  selectedCoupon: Coupon | null;
}

const initialState: CouponState = {
  coupons: [],
  loading: false,
  error: null,
  selectedCoupon: null,
};

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    clearSelectedCoupon(state) {
      state.selectedCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch coupons";
        toast.error(state.error);
      })

      .addCase(fetchCouponById.fulfilled, (state, action) => {
        state.selectedCoupon = action.payload;
      })

      .addCase(createCoupon.fulfilled, (state, action) => {
        state.coupons.push(action.payload);
        toast.success("Coupoun Created");
      })

      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) state.coupons[index] = action.payload;
        toast.success("Coupoun updated");
      })

      .addCase(deleteCouponById.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter((c) => c.id !== action.payload);
        toast.success("Coupouns Deleted");
      })

      .addCase(deleteAllCoupons.fulfilled, (state) => {
        state.coupons = [];
        toast.success("All Coupouns Deleted");
      });
  },
});

export const { clearSelectedCoupon } = couponSlice.actions;

export const selectCoupons = (state: RootState) => state.offers.coupons;
export const selectSelectedCoupon = (state: RootState) =>
  state.offers.selectedCoupon;
export const selectCouponLoading = (state: RootState) => state.offers.loading;
export const selectCouponError = (state: RootState) => state.offers.error;

export default couponSlice.reducer;
