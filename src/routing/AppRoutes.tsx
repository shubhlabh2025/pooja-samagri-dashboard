// routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashbordLayouts";
import DashboardPage from "../pages/Orders/index";
import LoginForm from "@/pages/Auth";
import Productpage from "@/pages/Product";
import ProductVariantsForm from "@/pages/Product/ProductForm";
import CategoryPage from "@/pages/Category";
import CategoryForm from "@/pages/Category/CategoryForm";
import CustomerPage from "@/pages/Customers";
import CustomerDetailSection from "@/pages/Customers/CustomerDetailSection";
import OrderDetailSection from "@/pages/Orders/OrderDetailSection";
import ConfigurationSection from "@/pages/Configurations";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginForm></LoginForm>} />
    <Route
      path="/orders"
      element={
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      }
    />
  <Route
      path="/OrderDetailSection"
      element={
        <DashboardLayout>
          <OrderDetailSection />
        </DashboardLayout>
      }
    />
    
    <Route
      path="/products"
      element={
        <DashboardLayout>
          <Productpage />
        </DashboardLayout>
      }
    />
    <Route
      path="/productForm"
      element={
        <DashboardLayout>
          <ProductVariantsForm />
        </DashboardLayout>
      }
    />
    <Route
      path="/category"
      element={
        <DashboardLayout>
          <CategoryPage />
        </DashboardLayout>
      }
    />

        <Route
      path="/categoryForm"
      element={
        <DashboardLayout>
          <CategoryForm />
        </DashboardLayout>
      }
    />
    <Route
      path="/customers"
      element={
        <DashboardLayout>
          <CustomerPage />
        </DashboardLayout>
      }
    />

        <Route
      path="/customerDetails"
      element={
        <DashboardLayout>
          <CustomerDetailSection />
        </DashboardLayout>
      }
    />
    <Route
      path="/configurations"
      element={
        <DashboardLayout>
          <ConfigurationSection />
        </DashboardLayout>
      }
    />
  </Routes>
);
export default AppRoutes;
