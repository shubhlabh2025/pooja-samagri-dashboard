import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { Order, AllOrderDetail } from "@/interfaces/orders";
import { createOrderApi } from "@/api/ordersAPI";
import axiosClient from "@/api/apiClient";
import type { PaginationMeta } from "@/interfaces/Pagination";
import { toast } from "react-toastify";

const orderApi = createOrderApi(axiosClient);

// Thunks
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    order_number?: string;
    phone_number?: string;
  }) => {
    const res = await orderApi.getAllOrders(params);
    return res.data;
  },
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id: string) => {
    const res = await orderApi.getOrderById(id);
    return res.data.data;
  },
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({
    id,
    status,
    comment = "",
  }: {
    id: string;
    status: string;
    comment?: string;
  }) => {
    await orderApi.updateOrderStatus(id, status, comment);
    return { id, status, comment };
  },
);

// Slice state interface
interface OrderState {
  orders: Order[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  selectedOrderDetail: AllOrderDetail | null; // <-- Separate detail
}

const initialState: OrderState = {
  orders: [],
  meta: null,
  loading: false,
  error: null,
  selectedOrderDetail: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrderDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
        state.meta = action.payload.meta || null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
        toast.error(state.error);
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrderDetail = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch order detail";
        state.selectedOrderDetail = null;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const index = state.orders.findIndex((o) => o.id === id);
        if (index !== -1) {
          state.orders[index].status = status;
        }
        toast.success("Order Status Updated");
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to Update order Status";
        toast.error(state.error);
      });
  },
});

export const { clearSelectedOrder } = orderSlice.actions;

// Selectors
export const selectOrders = (state: RootState) => state.order.orders;
export const selectOrderMeta = (state: RootState) => state.order.meta;
export const selectSelectedOrderDetail = (state: RootState) =>
  state.order.selectedOrderDetail;
export const selectOrderLoading = (state: RootState) => state.order.loading;
export const selectOrderError = (state: RootState) => state.order.error;

export default orderSlice.reducer;
