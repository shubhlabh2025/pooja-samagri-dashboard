import { type FC, useState } from "react";
import CategoryListSection from "@/components/Category/CategoryListSection";
import CategoryForm from "./CategoryForm";
import Modal from "@/components/Common/Modal";

const CategoryPage: FC = () => {
  const [showCategoryModal, setCategoryModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between px-1">
        <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
        <div
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
          onClick={() => setCategoryModal(true)}
        >
          <span>+ Add Categories</span>
        </div>
      </div>

      {/* Categories List */}
      <CategoryListSection />

      {/* Modal */}
      {showCategoryModal && (
        <Modal onClose={() => setCategoryModal(false)}>
          <CategoryForm onClose={() => setCategoryModal(false)} />
        </Modal>
      )}
    </div>
  );
};

export default CategoryPage;
