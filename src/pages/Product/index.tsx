
import type { FC } from "react";
import ProductListSection from "@/components/products/ProductListSection";

import AddButton from "../../assets/plus.png"
import { Link } from "react-router";

const Productpage: FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between px-1">
        <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
        <Link
        to= "/productForm">
        <img src={AddButton} className="h-6 w-6"></img> 

        </Link> 
      </div>



      {/* Charts Section */}
      <ProductListSection></ProductListSection>
    </div>
  );
};

export default Productpage;
