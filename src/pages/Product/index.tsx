import type { FC } from "react";
import ProductListSection from "@/components/products/ProductListSection";

import { Link } from "react-router";

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
      <ProductListSection></ProductListSection>
    </div>
  );
};

export default Productpage;
