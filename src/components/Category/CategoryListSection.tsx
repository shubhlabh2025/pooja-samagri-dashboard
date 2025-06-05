import React, { useState, useEffect, useRef } from "react";
import { Trash2, Search, X, ChevronDown, Edit2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchCategories, deleteCategory } from "@/slices/categorySlice";
import {
  fetchSubCategories,
  deleteSubCategory,
} from "@/slices/subCategorySlice";
import Modal from "../Common/Modal";
import CategoryForm from "@/pages/Category/CategoryForm";
import SubCategoryForm from "@/pages/Category/SubCategoryForm";
import DismissDialog from "../Common/DismissDialog";

const PAGE_SIZE = 6;
const DEBOUNCE_MS = 200;

const CategoryListSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, status, error, pagination } = useAppSelector(
    (state) => state.categories
  );
  const subCategoryState = useAppSelector((state) => state.subCategories);

  const [currentPage, setCurrentPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showSubDialog, setShowSubDialog] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Edit Modal
  const [editCategory, setEditCategory] = useState<any>(null);
  const [showCategoryModal, setCategoryModal] = useState(false);

  // Subcategory modal
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null
  );
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [editSubCategory, setEditSubCategory] = useState<any>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchText.trim());
      setCurrentPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Fetch categories
  useEffect(() => {
    dispatch(
      fetchCategories({ page: currentPage, pageSize: PAGE_SIZE, q: query })
    );
  }, [dispatch, currentPage, query]);

  // Fetch subcategories on expand
  useEffect(() => {
    if (expandedCategoryId) {
      dispatch(fetchSubCategories({ parent_id: expandedCategoryId }));
    }
  }, [expandedCategoryId, dispatch]);

  // Pagination logic
  const totalPages = pagination?.totalPages || 1;
  const MAX_BUTTONS = 5;
  let startPage = Math.max(1, currentPage - Math.floor(MAX_BUTTONS / 2));
  let endPage = Math.min(totalPages, startPage + MAX_BUTTONS - 1);
  if (endPage - startPage < MAX_BUTTONS - 1) {
    startPage = Math.max(1, endPage - MAX_BUTTONS + 1);
  }

  const handleDelete = () => {
    // Do the delete logic here
  };
  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) pageButtons.push(i);

  // Get subcategories for expanded category
  const subCategories = subCategoryState.subCategories.filter(
    (s) => s.parent_id === expandedCategoryId
  );
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 hover:bg-blue-50 gap-3 cursor-pointer">
              <div className="flex items-center gap-4">
                <img
                  src={category.image}
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
                  onClick={() => {
                    setEditCategory(category);
                    setCategoryModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Edit Category"
                >
                  <Edit2 />
                </button>
                <button
                  className="text-red-600 hover:text-red-800 transition"
                  onClick={() => setShowDialog(true)}
                >
                  {" "}
                  <Trash2 />
                </button>
                <DismissDialog
                  open={showDialog}
                  title="Delete Category"
                  message="Are you sure you want to delete this Category?."
                  confirmLabel="Delete"
                  cancelLabel="Cancel"
                  onConfirm={() => {
                    dispatch(deleteCategory(category.id));
                    setShowDialog(false);
                  }}
                  onCancel={() => setShowDialog(false)}
                />
                <ChevronDown
                  className="text-gray-500 cursor-pointer"
                  onClick={() =>
                    setExpandedCategoryId(
                      expandedCategoryId === category.id ? null : category.id
                    )
                  }
                />
              </div>
            </div>
            {/* Expanded subcategory list/modal */}
            {expandedCategoryId === category.id && (
              <div className="ml-14 mr-14 mt-3 space-y-2">
                {/* Subcategory list */}
                {subCategoryState.status === "loading" ? (
                  <div className="px-4 py-2 text-gray-400">Loading...</div>
                ) : (
                  <>
                    {subCategories.length > 0 ? (
                      subCategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between px-4 py-2 rounded bg-gray-50 hover:bg-gray-100 border"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={sub.image}
                              alt={sub.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm font-medium text-gray-800">
                              {sub.name}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit Subcategory"
                              onClick={() => {
                                setEditSubCategory(sub);
                                setShowSubCategoryModal(true);
                              }}
                            >
                              <Edit2 size={16} />
                            </button>

                            <button
                              className="text-red-600 hover:text-red-800 transition"
                              onClick={() => setShowSubDialog(true)}
                            >
                              {" "}
                              <Trash2 />
                            </button>
                            <DismissDialog
                              open={showSubDialog}
                              title="Delete Subcategory"
                              message="Are you sure you want to delete this Subcategory?"
                              confirmLabel="Delete"
                              cancelLabel="Cancel"
                              onConfirm={() => {
                                dispatch(deleteSubCategory(sub.id));
                                setShowSubDialog(false);
                              }}
                              onCancel={() => setShowSubDialog(false)}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        No subcategories yet.
                      </div>
                    )}
                  </>
                )}
                {/* Add New Subcategory Button */}
                <div className="w-full flex justify-center my-6">
                  <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => {
                      setEditSubCategory(null);
                      setShowSubCategoryModal(true);
                    }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200">
                      <span className="text-blue-600 text-lg font-bold">+</span>
                    </div>
                    <span className="text-sm text-blue-600 group-hover:underline">
                      Add Subcategory
                    </span>
                  </div>
                </div>
                {showSubCategoryModal && (
                  <Modal
                    onClose={() => {
                      setShowSubCategoryModal(false);
                      setEditSubCategory(null);
                    }}
                  >
                    <SubCategoryForm
                      parentId={category.id}
                      initialData={editSubCategory}
                      subCategoryId={editSubCategory?.id}
                      onClose={() => {
                        setShowSubCategoryModal(false);
                        setEditSubCategory(null);
                      }}
                    />
                  </Modal>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
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
      {/* Category Modal (for edit/create) */}
      {showCategoryModal && (
        <Modal
          onClose={() => {
            setCategoryModal(false);
            setEditCategory(null);
          }}
        >
          <CategoryForm
            initialData={editCategory}
            categoryId={editCategory?.id}
            onClose={() => {
              setCategoryModal(false);
              setEditCategory(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default CategoryListSection;
