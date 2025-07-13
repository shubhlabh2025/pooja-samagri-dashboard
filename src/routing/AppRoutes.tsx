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
import UpdateProductForm from "@/pages/Product/UpdateProductForm";
import OffersPage from "@/pages/Configurations/OffersPage";
import CreateOfferPage from "@/pages/Configurations/CreateOfferPage";
import UpdateOfferPage from "@/pages/Configurations/UpdateOfferPage";

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
      path="/order/:id"
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
      path="/updateProductForm/:productId"
      element={
        <DashboardLayout>
          <UpdateProductForm />
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
      path="/customerDetails/:userId"
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
    <Route
      path="/offers"
      element={
        <DashboardLayout>
          <OffersPage />
        </DashboardLayout>
      }
    />
    <Route
      path="/createOffers"
      element={
        <DashboardLayout>
          <CreateOfferPage />
        </DashboardLayout>
      }
    />

    <Route
      path="/updateOffer/:offerId"
      element={
        <DashboardLayout>
          <UpdateOfferPage />
        </DashboardLayout>
      }
    />
  </Routes>
);
export default AppRoutes;
