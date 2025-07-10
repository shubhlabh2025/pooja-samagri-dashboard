import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../src/slices/productSlice";
import categoriesReducer from "./slices/categorySlice";
import subCategoriesReducer from "./slices/subCategorySlice";
import configurationReducer from "./slices/configurationSlice";
import offersReducer from "./slices/offerSlice";
import authReducer from "./slices/authSlice";
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoriesReducer,
    subCategories: subCategoriesReducer,
    configurations: configurationReducer,
    offers: offersReducer,
    auth: authReducer,
    order: orderReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
