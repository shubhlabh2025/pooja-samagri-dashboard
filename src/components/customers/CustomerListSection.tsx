import type { Category } from "@/interfaces/category";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import userAvatar from "../../assets/user.png";
import { Link } from "react-router";
const mockCategories: Category[] = [
  {
    id: 1,
    name: "Ansh",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 2,
    name: "Rahul",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 3,
    name: "Mohit",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 4,
    name: "Sharma",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 5,
    name: "Sehwag",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 6,
    name: "Hitesh",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 7,
    name: "Mitesh",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 8,
    name: "Hari Ram",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 9,
    name: "Tarun",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
  {
    id: 10,
    name: "Sonam",
    image:
      "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
  },
];
const CustomerListSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const displayedCategories = showAll
    ? mockCategories
    : mockCategories.slice(0, 6);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b px-6 py-4 text-lg border-l-4 border-blue-500 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Customer Details</span>
        <span
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          {showAll ? "View Less" : "View All"}
        </span>
      </div>
      <div className="divide-y">
        {displayedCategories.map((category) => (
          <Link to="/customerDetails">
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
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">
                    {"9 order(s), Total Amont - Rs.3999"}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CustomerListSection;
