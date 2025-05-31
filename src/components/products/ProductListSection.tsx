import React, { useState } from "react";
import userAvatar from "../../assets/user.png";
import type { Product } from "@/interfaces/product";
import { Delete, Trash2 } from "lucide-react";
const mockUsers: Product[] = [
  {
    id: "1",
    out_of_stock: false,
    default_variant_id: "v1",
    product_variants: [
      {
        variant_id: "v1",
        product_id: "1",
        display_label: "Large",
        name: "Basic T-shirt",
        description: "A comfortable cotton t-shirt. ",
        mrp: 499,
        price: 299,
        categories: [],
        image: [
          "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
        ],
        brand_name: "ComfortWear",
        out_of_stock: false,
        min_quantity: 1,
        max_quantity: 5,
        total_available_quantity: 100,
      },
    ],
  },
  {
    id: "2",
    out_of_stock: true,
    default_variant_id: "v2",
    product_variants: [
      {
        variant_id: "v2",
        product_id: "2",
        display_label: "Medium",
        name: "Denim Jeans",
        description: "Slim fit stretchable jeans.",
        mrp: 1299,
        price: 999,
        categories: [],
        image: [
          "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
        ],
        brand_name: "DenimX",
        out_of_stock: true,
        min_quantity: 1,
        max_quantity: 3,
        total_available_quantity: 50,
      },
    ],
  },
  {
    id: "3",
    out_of_stock: false,
    default_variant_id: "v3",
    product_variants: [
      {
        variant_id: "v3",
        product_id: "3",
        display_label: "One Size",
        name: "Canvas Tote Bag",
        description: "Eco-friendly shopping tote.",
        mrp: 399,
        price: 249,
        categories: [],
        image: [
          "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
        ],
        brand_name: "EcoStyle",
        out_of_stock: false,
        min_quantity: 1,
        max_quantity: 10,
        total_available_quantity: 200,
      },
    ],
  },
  {
    id: "4",
    out_of_stock: false,
    default_variant_id: "v4",
    product_variants: [
      {
        variant_id: "v4",
        product_id: "4",
        display_label: "Free Size",
        name: "Wool Beanie",
        description: "Warm and stylish beanie.",
        mrp: 599,
        price: 349,
        categories: [],
        image: [
          "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
        ],
        brand_name: "WinterWear",
        out_of_stock: false,
        min_quantity: 1,
        max_quantity: 4,
        total_available_quantity: 120,
      },
    ],
  },
  {
    id: "5",
    out_of_stock: true,
    default_variant_id: "v5",
    product_variants: [
      {
        variant_id: "v5",
        product_id: "5",
        display_label: "Size 9",
        name: "Running Shoes",
        description: "Lightweight and durable.",
        mrp: 2999,
        price: 2199,
        categories: [],
        image: [
          "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
        ],
        brand_name: "RunX",
        out_of_stock: true,
        min_quantity: 1,
        max_quantity: 2,
        total_available_quantity: 20,
      },
    ],
  },
  {
    id: "6",
    out_of_stock: false,
    default_variant_id: "v6",
    product_variants: [
      {
        variant_id: "v6",
        product_id: "6",
        display_label: "Standard",
        name: "Bluetooth Headphones",
        description: "Noise-cancelling headphones.",
        mrp: 3499,
        price: 2799,
        categories: [],
        image: [
          "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
        ],
        brand_name: "SoundMax",
        out_of_stock: false,
        min_quantity: 1,
        max_quantity: 1,
        total_available_quantity: 75,
      },
    ],
  },
  {
    id: "7",
    out_of_stock: false,
    default_variant_id: "v7",
    product_variants: [
      {
        variant_id: "v7",
        product_id: "7",
        display_label: "500ml",
        name: "Water Bottle",
        description: "Insulated steel bottle.",
        mrp: 699,
        price: 499,
        categories: [],
        image: [
          "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
        ],
        brand_name: "HydroSafe",
        out_of_stock: false,
        min_quantity: 1,
        max_quantity: 6,
        total_available_quantity: 180,
      },
    ],
  },
  {
    id: "8",
    out_of_stock: false,
    default_variant_id: "v8",
    product_variants: [
      {
        variant_id: "v8",
        product_id: "8",
        display_label: "Pack of 3",
        name: "Socks Set",
        description: "Soft cotton socks.",
        mrp: 299,
        price: 199,
        categories: [],
        image: [
          "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
        ],
        brand_name: "FootFlex",
        out_of_stock: false,
        min_quantity: 1,
        max_quantity: 3,
        total_available_quantity: 90,
      },
    ],
  },
  {
    id: "9",
    out_of_stock: true,
    default_variant_id: "v9",
    product_variants: [
      {
        variant_id: "v9",
        product_id: "9",
        display_label: "King Size",
        name: "Bedsheet Set",
        description: "Soft cotton double bedsheet.",
        mrp: 1799,
        price: 1399,
        categories: [],
        image: [
          "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
        ],
        brand_name: "HomeFab",
        out_of_stock: true,
        min_quantity: 1,
        max_quantity: 2,
        total_available_quantity: 40,
      },
    ],
  },
  {
    id: "10",
    out_of_stock: false,
    default_variant_id: "v10",
    product_variants: [
      {
        variant_id: "v10",
        product_id: "10",
        display_label: "Standard",
        name: "Notebook",
        description: "Hardcover ruled notebook.",
        mrp: 149,
        price: 99,
        categories: [],
        image: [
          "https://assets.customerglu.com/35deace8-c04f-43c3-a00b-9c06eaae7acb/WhatsApp Image 2025-05-12 at 01.36.19.jpeg",
        ],
        brand_name: "NoteX",
        out_of_stock: false,
        min_quantity: 1,
        max_quantity: 10,
        total_available_quantity: 300,
      },
    ],
  },
];

const ProductListSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const displayedProducts = showAll ? mockUsers : mockUsers.slice(0, 6);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b px-6 py-4 text-lg border-l-4 border-blue-500 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Our Products</span>
        <span
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          {showAll ? "View Less" : "View All"}
        </span>
      </div>
      <div className="divide-y">
        {displayedProducts.map((product) => {
          const variant = product.product_variants[0];
          return (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 hover:bg-blue-50 gap-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={variant.image[0] || userAvatar}
                  alt={variant.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {variant.name}
                  </div>
                  <div className="text-xs text-black-500 truncate max-w-[200px]">
                    {variant.description}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-row items-center justify-end gap-2 sm:gap-6 w-full sm:w-auto">
                <div className="text-sm text-black-500 font-semibold">
                  Rs. {variant.price.toFixed(2)}
                </div>
                <div className="flex gap-2">
                  <Trash2 />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default ProductListSection;
