
import type { FC } from "react";

import AddButton from "../../assets/plus.png"
import { Link } from "react-router";
import CategoryListSection from "@/components/Category/CategoryListSection";

const CategoryPage: FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between px-1">
        <h2 className="text-2xl font-semibold text-gray-800">Product Categories</h2>
        <Link
        to= "/CategoryForm">
        <img src={AddButton} className="h-6 w-6"></img> 

        </Link> 
      </div>



      {/* Charts Section */}
      <CategoryListSection></CategoryListSection>
    </div>
  );
};

export default CategoryPage;
