import React, { useState, useEffect, useRef } from "react";
import userAvatar from "../../assets/user.png";
import { Trash2, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchProducts, deleteProduct } from "../../slices/productSlice";
import { ProductSkeleton } from "../loadingSkeletons/productSkeleton";
import { ErrorMessage } from "../Common/ErrorMessage";
import DismissDialog from "../Common/DismissDialog";
import type { SubCategories } from "@/interfaces/subcategories";
import { fetchCategories } from "@/slices/categorySlice";
import { createSubCategoryApi } from "@/api/subCategoriesApi";
import axiosClient from "@/api/apiClient";

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 200;

const ProductListSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, status, error, pagination } = useAppSelector(
    (state) => state.products,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState<SubCategories[]>([]);
  const [categories, setCategories] = useState<SubCategories[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [showDialog, setShowDialog] = useState(false);
  const subCategoryApi = createSubCategoryApi(axiosClient);

  // Debounce searchText -> query
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchText.trim());
      setCurrentPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Fetch products on change
  useEffect(() => {
    dispatch(
      fetchProducts({
        page: currentPage,
        pageSize: PAGE_SIZE,
        q: query,
        category_id: subCategoryId || categoryId || "",
      }),
    );
  }, [dispatch, currentPage, query, categoryId, subCategoryId]);

  useEffect(() => {
    const fetchAndSetCategories = async () => {
      try {
        const response = await dispatch(
          fetchCategories({
            page: 1,
            pageSize: 50,
          }),
        ).unwrap();
        setCategories(response.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchAndSetCategories();
  }, [dispatch]);

  const handleCategoryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedId = e.target.value;
    setCategoryId(selectedId);
    setSubCategoryId(""); // Reset subcategory
    setCurrentPage(1);

    if (selectedId) {
      try {
        const params = {}; // Or get it from the outer scope if it exists

        const response = await subCategoryApi.getSubCategoriesById({
          ...params, // Spreads any existing page, pageSize from the outer 'params'
          ids: [selectedId], // 'ids' should be an array of strings
        });
        setSubCategories(response.data?.data || []);
      } catch (err) {
        console.error("Failed to load subcategories locally", err);
        setSubCategories([]);
      }
    } else {
      setSubCategories([]);
    }
  };

  const displayedProducts = Array.isArray(products) ? products : [];

  const totalPages = pagination?.totalPages || 1;
  const pageButtons = [];
  const MAX_BUTTONS = 5;
  let startPage = Math.max(1, currentPage - Math.floor(MAX_BUTTONS / 2));
  const endPage = Math.min(totalPages, startPage + MAX_BUTTONS - 1);
  if (endPage - startPage < MAX_BUTTONS - 1) {
    startPage = Math.max(1, endPage - MAX_BUTTONS + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(i);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b px-6 py-4 text-lg border-l-4 border-blue-500 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Our Products</span>
        <div className="flex gap-2">
          {!showSearch && (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded bg-gray-100 hover:bg-blue-100 text-blue-600"
              title="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex items-center gap-2 px-2">
          <select
            value={categoryId}
            onChange={handleCategoryChange}
            className="px-1 py-2 border border-gray-300 rounded focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 px-2">
          <select
            value={subCategoryId}
            onChange={(e) => {
              setSubCategoryId(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2 py-2 border border-gray-300 rounded focus:outline-none"
            disabled={!categoryId}
          >
            <option value="">SubCategories</option>
            {subCategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filter Dropdown */}

      {/* Search Bar */}
      {showSearch && (
        <div className="flex gap-2 px-6 py-2 bg-gray-50 border-b">
          <input
            ref={inputRef}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search products by name..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded focus:outline-none"
          />
          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setShowSearch(false);
              setSearchText("");
            }}
            className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
            title="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading / Error */}
      {status === "loading" && (
        <div>
          {[...Array(6)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}
      {status === "failed" && (
        <ErrorMessage message={error || "Something went wrong"} />
      )}

      {/* Products List */}
      <div className="divide-y">
        {displayedProducts.map((product) => {
          const variant =
            Array.isArray(product.product_variants) &&
            product.product_variants.length > 0
              ? product.product_variants[0]
              : null;
          if (!variant) return null;

          return (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 hover:bg-blue-50 gap-3 group"
            >
              <Link
                to={`/updateProductForm/${product.id}`}
                className="flex-1 min-w-0"
                style={{ textDecoration: "none" }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={variant.images[0] || userAvatar}
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
              </Link>
              <div className="flex flex-wrap sm:flex-row items-center justify-end gap-2 sm:gap-6 w-full sm:w-auto">
                <div className="text-sm text-black-500 font-semibold">
                  Rs. {variant.price.toFixed(2)}
                </div>

                <button
                  className="text-red-600 hover:text-red-800 transition"
                  onClick={() => setShowDialog(true)}
                >
                  <Trash2 />
                </button>
                <DismissDialog
                  open={showDialog}
                  title="Delete Product"
                  message="Are you sure you want to delete this Product?."
                  confirmLabel="Delete"
                  cancelLabel="Cancel"
                  onConfirm={() => {
                    dispatch(deleteProduct(product.id));
                    setShowDialog(false);
                  }}
                  onCancel={() => setShowDialog(false)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 py-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
          >
            Prev
          </button>
          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                1
              </button>
              {startPage > 2 && <span className="px-1">...</span>}
            </>
          )}
          {pageButtons.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-1">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListSection;
