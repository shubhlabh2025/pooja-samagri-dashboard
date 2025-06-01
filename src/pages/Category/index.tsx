import { type FC, useState } from "react";
import CategoryListSection from "@/components/Category/CategoryListSection";
import CategoryForm from "./CategoryForm";

const CategoryPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between px-1">
        <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
        <div
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <span>+ Add Categories</span>
        </div>
      </div>

      {/* Categories List */}
      <CategoryListSection onItemClick={() => setIsModalOpen(true)} />

      {/* Modal */}
      {isModalOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 shadow-lg w-full max-w-2xl relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>
            <CategoryForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
