import { useEffect, type FC } from "react";
import ProductListSection from "@/components/products/ProductListSection";
import { SkeletonTheme } from "react-loading-skeleton";

import { Link } from "react-router";
import { fetchCategories } from "@/slices/categorySlice";

const Productpage: FC = () => {

  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between px-1">
        <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
        <Link
          to="/productForm"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <span>+ Add Product</span>
        </Link>
      </div>

      {/* Charts Section */}
      <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
        <ProductListSection></ProductListSection>
      </SkeletonTheme>
    </div>
  );
};

export default Productpage;
