import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../src/slices/productSlice";
import  categoriesReducer  from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
     categories: categoriesReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


