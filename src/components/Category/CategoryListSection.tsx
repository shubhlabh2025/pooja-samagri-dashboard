// src/components/Category/CategoryListSection.tsx
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchCategories, deleteCategory } from "@/slices/categorySlice";
import { Trash2, Search, X, ChevronDown } from "lucide-react";
import userAvatar from "../../assets/user.png";
import Modal from "../Common/Modal";
import SubCategoryForm from "@/pages/Category/SubCategoryForm";

const PAGE_SIZE = 6;
const DEBOUNCE_MS = 200;

const CategoryListSection: React.FC<{ onItemClick?: () => void }> = ({
  onItemClick,
}) => {
  const dispatch = useAppDispatch();
  const { categories, status, error, pagination } = useAppSelector(
    (state) => state.categories
  );

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchText.trim());
      setCurrentPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Fetch categories on page or query change
  useEffect(() => {
    dispatch(
      fetchCategories({ page: currentPage, pageSize: PAGE_SIZE, q: query })
    );
  }, [dispatch, currentPage, query]);

  useEffect(() => {
    if (showSearch && inputRef.current) inputRef.current.focus();
  }, [showSearch]);

  const totalPages = pagination?.totalPages || 1;
  const MAX_BUTTONS = 5;
  let startPage = Math.max(1, currentPage - Math.floor(MAX_BUTTONS / 2));
  let endPage = Math.min(totalPages, startPage + MAX_BUTTONS - 1);
  if (endPage - startPage < MAX_BUTTONS - 1) {
    startPage = Math.max(1, endPage - MAX_BUTTONS + 1);
  }
  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) pageButtons.push(i);

  // Delete category
  const handleDelete = (categoryId: string) => {
    dispatch(deleteCategory(categoryId));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Top Bar */}
      <div className="border-b px-6 py-4 text-lg border-l-4 border-blue-500 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Product Categories</span>
        <div className="flex gap-2">
          {!showSearch && (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded bg-gray-100 hover:bg-blue-100 text-blue-600"
              title="Search Categories"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      {/* Search Bar */}
      {showSearch && (
        <div className="flex gap-2 px-6 py-2 bg-gray-50 border-b">
          <input
            ref={inputRef}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search categories by name..."
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
      {/* Loading & Error */}
      {status === "loading" && (
        <div>
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <div
              key={i}
              className="h-16 flex items-center justify-center text-gray-400"
            >
              Loading...
            </div>
          ))}
        </div>
      )}
      {status === "failed" && (
        <div className="px-6 py-4 text-red-500">{error}</div>
      )}
      {/* Category List */}
      <div className="divide-y">
        {categories.map((category) => (
          <div key={category.id} className="group relative">
            <div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 hover:bg-blue-50 gap-3 cursor-pointer"
              onClick={onItemClick}
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(category.id);
                  }}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete Category"
                >
                  <Trash2 />
                </button>
                <ChevronDown className="text-gray-500 cursor-pointer" />
              </div>
            </div>
            {/* ...subcategories/modal as you want... */}
          </div>
        ))}
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

export default CategoryListSection;
