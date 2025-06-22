import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../src/slices/productSlice";
import  categoriesReducer  from "./slices/categorySlice";
import  subCategoriesReducer  from "./slices/subCategorySlice";
import  configurationReducer  from "./slices/configurationSlice";
import offersReducer from "./slices/offerSlice"

export const store = configureStore({
  reducer: {
    products: productReducer,
     categories: categoriesReducer,
     subCategories: subCategoriesReducer,
     configurations: configurationReducer,
     offers: offersReducer
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


