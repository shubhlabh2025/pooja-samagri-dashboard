import React, { useState } from "react";
import userAvatar from "../../assets/user.png";
import { Trash2 } from "lucide-react";
import type { Category } from "@/interfaces/category";
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
const CategoryListSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const displayedCategories = showAll
    ? mockCategories
    : mockCategories.slice(0, 6);

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
          <div
            key={category.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 hover:bg-blue-50 gap-3"
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
              <div className="flex gap-2">
                <Trash2 />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryListSection;
