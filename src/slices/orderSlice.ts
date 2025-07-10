import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { Order } from "@/interfaces/orders";
import { createOrderApi } from "@/api/ordersAPI";
import axiosClient from "@/api/apiClient";
import type { PaginationMeta } from "@/interfaces/Pagination";

const orderApi = createOrderApi(axiosClient);

// Thunks
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    order_number?: string;
  }) => {
    const res = await orderApi.getAllOrders(params);
    return res.data; // includes both data and meta
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id: string) => {
    const res = await orderApi.getOrderById(id);
    return res.data.data; // single order
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }: { id: string; status: string }) => {
    await orderApi.updateOrderStatus(id, status); // returns only success message
    return { id, status }; // return minimal data needed to update state
  }
);
// Slice state interface
interface OrderState {
  orders: Order[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  selectedOrder: Order | null;
}

const initialState: OrderState = {
  orders: [],
  meta: null,
  loading: false,
  error: null,
  selectedOrder: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
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
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;

        // Update in order list
        const index = state.orders.findIndex((o) => o.id === id);
        if (index !== -1) {
          state.orders[index].status = status;
        }

        // Update selected order if needed
        if (state.selectedOrder?.id === id) {
          state.selectedOrder.status = status;
        }
      })

      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      });
  },
});

export const { clearSelectedOrder } = orderSlice.actions;

// Selectors
export const selectOrders = (state: RootState) => state.order.orders;
export const selectOrderMeta = (state: RootState) => state.order.meta;
export const selectSelectedOrder = (state: RootState) =>
  state.order.selectedOrder;
export const selectOrderLoading = (state: RootState) => state.order.loading;
export const selectOrderError = (state: RootState) => state.order.error;

export default orderSlice.reducer;
