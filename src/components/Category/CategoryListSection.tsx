import React, { useState } from "react";
import userAvatar from "../../assets/user.png";
import { ChevronDown, Trash2 } from "lucide-react";
import type { Category } from "@/interfaces/category";
import Modal from "../Common/Modal";
import CategoryForm from "@/pages/Category/CategoryForm";

interface CategoryListSectionProps {
  onItemClick?: () => void;
}

const mockCategories: Category[] = [
  {
    id: 1,
    name: "T-Shirts",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 2,
    name: "Jeans",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 3,
    name: "Bags",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 4,
    name: "Hats",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 5,
    name: "Shoes",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 6,
    name: "Headphones",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 7,
    name: "Bottles",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 8,
    name: "Socks",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 9,
    name: "Bedsheets",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 10,
    name: "Stationery",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
];

// mock subcategories per category
const mockSubCategories: { [key: number]: string[] } = {
  1: ["Round Neck", "V-Neck"],
  2: ["Skinny", "Straight Fit"],
  3: ["Backpacks", "Totes"],
};

const CategoryListSection: React.FC<CategoryListSectionProps> = ({
  onItemClick,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [showSubCateory, setSubCategoryModal] = useState(false);

  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null
  );

  const displayedCategories = showAll
    ? mockCategories
    : mockCategories.slice(0, 6);

  const toggleSubList = (id: number) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b px-6 py-4 text-lg border-l-4 border-blue-500 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Product Categories</span>
        <span
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          {showAll ? "View Less" : "View All"}
        </span>
      </div>

      <div className="divide-y">
        {displayedCategories.map((category) => (
          <div key={category.id} className="group relative">
            <div
              onClick={onItemClick}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 hover:bg-blue-50 gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img
                  src={category.image || userAvatar}
                  alt={category.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {category.name}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-row items-center justify-end gap-2 sm:gap-6 w-full sm:w-auto">
                <Trash2 className="text-gray-500" />
                <ChevronDown
                  className="text-gray-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSubList(category.id);
                  }}
                />
              </div>
            </div>

            {/* Expanded Subcategory List */}
            {expandedCategoryId === category.id && (
              <div className="ml-14 mr-14 mt-3 space-y-2">
                {(mockSubCategories[category.id] || []).map((sub, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-2 rounded bg-gray-50 hover:bg-gray-100 border"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={userAvatar} // Or you can store an image URL in sub and use it here
                        alt={sub}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {sub}
                      </span>
                    </div>
                    {/* Optional delete or edit icons can be added here */}
                  </div>
                ))}

                {/* Add New Subcategory Button */}
                <div className="w-full flex justify-center my-6">
                  <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setSubCategoryModal(true)}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200">
                      <span className="text-blue-600 text-lg font-bold">+</span>
                    </div>
                    <span className="text-sm text-blue-600 group-hover:underline">
                      Add Subcategory
                    </span>
                  </div>
                </div>
                {showSubCateory && (
                  <Modal onClose={() => setSubCategoryModal(false)}>
                    <CategoryForm />
                  </Modal>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryListSection;
