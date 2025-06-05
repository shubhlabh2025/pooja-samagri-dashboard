import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../src/slices/productSlice";
import  categoriesReducer  from "./slices/categorySlice";
import  subCategoriesReducer  from "./slices/subCategorySlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
     categories: categoriesReducer,
     subCategories: subCategoriesReducer
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


