import React, { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Search,
  X,
  ChevronDown,
  Edit2,
  GripVertical,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  fetchCategories,
  deleteCategory,
  updateCategory,
} from "@/slices/categorySlice";
import {
  fetchSubCategories,
  deleteSubCategory,
  updateSubCategory, // Assuming you have this action
} from "@/slices/subCategorySlice";
import Modal from "../Common/Modal";
import CategoryForm from "@/pages/Category/CategoryForm";
import SubCategoryForm from "@/pages/Category/SubCategoryForm";
import DismissDialog from "../Common/DismissDialog";
import { ProductSkeleton } from "../loadingSkeletons/productSkeleton";

const PAGE_SIZE = 30;
const DEBOUNCE_MS = 200;

// Type definitions
interface Category {
  id: string;
  name: string;
  image: string;
  priority: string | number;
}

interface SubCategory {
  id: string;
  name: string;
  image: string;
  parent_id: string;
  priority: string | number; // Add priority to SubCategory interface
}

interface DragState<T> {
  isDragging: boolean;
  draggedItem: T | null;
  dragOverIndex: number | null;
}

interface Pagination {
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

interface CategoryState {
  categories: Category[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: Pagination | null;
}

interface SubCategoryState {
  subCategories: SubCategory[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const CategoryListSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, status, error, pagination } = useAppSelector(
    (state) => state.categories,
  ) as CategoryState;
  const subCategoryState = useAppSelector(
    (state) => state.subCategories,
  ) as SubCategoryState;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showSubDialog, setShowSubDialog] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteSubItemId, setDeleteSubItemId] = useState<string | null>(null);

  // Drag and Drop State for Categories
  const [categoryDragState, setCategoryDragState] = useState<DragState<Category>>({
    isDragging: false,
    draggedItem: null,
    dragOverIndex: null,
  });
  const [localCategories, setLocalCategories] =
    useState<Category[]>(categories);

  // Drag and Drop State for Subcategories
  const [subCategoryDragState, setSubCategoryDragState] = useState<DragState<SubCategory>>({
    isDragging: false,
    draggedItem: null,
    dragOverIndex: null,
  });
  const [localSubCategories, setLocalSubCategories] =
    useState<SubCategory[]>(subCategoryState.subCategories);


  const inputRef = useRef<HTMLInputElement>(null);

  // Edit Modal
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [showCategoryModal, setCategoryModal] = useState<boolean>(false);

  // Subcategory modal
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null,
  );
  const [showSubCategoryModal, setShowSubCategoryModal] =
    useState<boolean>(false);
  const [editSubCategory, setEditSubCategory] = useState<SubCategory | null>(
    null,
  );

  // Update local categories when categories from store change
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  // Update local subcategories when subcategories from store change
  useEffect(() => {
    setLocalSubCategories(subCategoryState.subCategories);
  }, [subCategoryState.subCategories]);

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
      fetchCategories({ page: currentPage, pageSize: PAGE_SIZE, q: query }),
    );
  }, [dispatch, currentPage, query]);

  // Fetch subcategories on expand
  useEffect(() => {
    if (expandedCategoryId) {
      dispatch(fetchSubCategories({ parent_id: [expandedCategoryId] }));
    }
  }, [expandedCategoryId, dispatch]);

  // --- Utility for calculating new priority ---
  const calculateNewPriority = <T extends { priority: string | number }>(
    items: T[],
    targetIndex: number,
  ): number => {
    // If moving to top (index 0)
    if (targetIndex === 0) {
      const nextItem = items[1];
      if (nextItem) {
        return parseFloat(nextItem.priority.toString()) + 1000;
      }
      return 1000; // Default if no next item
    }

    // If moving to bottom (last index)
    if (targetIndex === items.length - 1) {
      const prevItem = items[targetIndex - 1];
      if (prevItem) {
        return parseFloat(prevItem.priority.toString()) / 2;
      }
      return 1000; // Default if no previous item
    }

    // If moving to middle, average the priorities of adjacent items
    const prevItem = items[targetIndex - 1];
    const nextItem = items[targetIndex + 1];

    if (prevItem && nextItem) {
      const prevPriority = parseFloat(prevItem.priority.toString());
      const nextPriority = parseFloat(nextItem.priority.toString());
      return (prevPriority + nextPriority) / 2;
    }

    // Fallback
    return 1000;
  };

  // --- Category Drag and Drop Handlers ---
  const handleCategoryDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    category: Category,
  ) => {
    setCategoryDragState({
      isDragging: true,
      draggedItem: category,
      dragOverIndex: null,
    });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "0.5";
  };

  const handleCategoryDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "1";
    setCategoryDragState({
      isDragging: false,
      draggedItem: null,
      dragOverIndex: null,
    });
  };

  const handleCategoryDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (categoryDragState.dragOverIndex !== index) {
      setCategoryDragState((prev) => ({
        ...prev,
        dragOverIndex: index,
      }));
    }
  };

  const handleCategoryDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const relatedTarget = e.relatedTarget as Node | null;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setCategoryDragState((prev) => ({
        ...prev,
        dragOverIndex: null,
      }));
    }
  };

  const handleCategoryDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number,
  ) => {
    e.preventDefault();

    if (!categoryDragState.draggedItem) return;

    const draggedIndex = localCategories.findIndex(
      (cat) => cat.id === categoryDragState.draggedItem!.id,
    );

    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      setCategoryDragState({
        isDragging: false,
        draggedItem: null,
        dragOverIndex: null,
      });
      return;
    }

    const newCategories = [...localCategories];
    const [draggedItem] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(dropIndex, 0, draggedItem);

    const newPriority = calculateNewPriority(newCategories, dropIndex);

    const updatedCategories = newCategories.map((cat, index) =>
      index === dropIndex ? { ...cat, priority: newPriority } : cat,
    );

    setLocalCategories(updatedCategories);

    const categoryToUpdate = updatedCategories.find(
      (cat) => cat.id === draggedItem.id,
    );

    setCategoryDragState({
      isDragging: false,
      draggedItem: null,
      dragOverIndex: null,
    });

    if (categoryToUpdate) {
      await dispatch(
        updateCategory({
          id: categoryToUpdate.id,
          updates: {
            name: categoryToUpdate.name,
            priority: categoryToUpdate.priority,
            image: categoryToUpdate.image,
          },
        }),
      );
      // Re-fetch categories to ensure data consistency after drag-drop
      await dispatch(
        fetchCategories({ page: currentPage, pageSize: PAGE_SIZE, q: query }),
      );
    }
  };

  // --- Subcategory Drag and Drop Handlers ---
  const handleSubDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    subCategory: SubCategory,
  ) => {
    setSubCategoryDragState({
      isDragging: true,
      draggedItem: subCategory,
      dragOverIndex: null,
    });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "0.5";
  };

  const handleSubDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "1";
    setSubCategoryDragState({
      isDragging: false,
      draggedItem: null,
      dragOverIndex: null,
    });
  };

  const handleSubDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (subCategoryDragState.dragOverIndex !== index) {
      setSubCategoryDragState((prev) => ({
        ...prev,
        dragOverIndex: index,
      }));
    }
  };

  const handleSubDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const relatedTarget = e.relatedTarget as Node | null;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setSubCategoryDragState((prev) => ({
        ...prev,
        dragOverIndex: null,
      }));
    }
  };

  const handleSubDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number,
  ) => {
    e.preventDefault();

    if (!subCategoryDragState.draggedItem || !expandedCategoryId) return;

    // Filter subcategories for the currently expanded category
    const currentSubCategories = localSubCategories.filter(
      (sub) => sub.parent_id === expandedCategoryId,
    );

    const draggedIndex = currentSubCategories.findIndex(
      (sub) => sub.id === subCategoryDragState.draggedItem!.id,
    );

    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      setSubCategoryDragState({
        isDragging: false,
        draggedItem: null,
        dragOverIndex: null,
      });
      return;
    }

    const newSubCategories = [...currentSubCategories];
    const [draggedSubItem] = newSubCategories.splice(draggedIndex, 1);
    newSubCategories.splice(dropIndex, 0, draggedSubItem);

    const newPriority = calculateNewPriority(newSubCategories, dropIndex);

    const updatedSubCategoriesForDisplay = newSubCategories.map((sub, index) =>
      index === dropIndex ? { ...sub, priority: newPriority } : sub,
    );

    // Update the localSubCategories state with the reordered items
    setLocalSubCategories((prev) => {
      const otherSubCategories = prev.filter(
        (sub) => sub.parent_id !== expandedCategoryId,
      );
      return [...otherSubCategories, ...updatedSubCategoriesForDisplay];
    });

    const subCategoryToUpdate = updatedSubCategoriesForDisplay.find(
      (sub) => sub.id === draggedSubItem.id,
    );

    setSubCategoryDragState({
      isDragging: false,
      draggedItem: null,
      dragOverIndex: null,
    });

    if (subCategoryToUpdate) {
      // Dispatch action to update backend
      await dispatch(
        updateSubCategory({
          id: subCategoryToUpdate.id,
          updates: {
            name: subCategoryToUpdate.name,
            priority: subCategoryToUpdate.priority,
            image: subCategoryToUpdate.image,
          },
        }),
      );
      // Re-fetch subcategories for consistency
      await dispatch(fetchSubCategories({ parent_id: [expandedCategoryId] }));
    }
  };

  // Pagination logic
  const totalPages = pagination?.totalPages || 1;
  const MAX_BUTTONS = 5;
  let startPage = Math.max(1, currentPage - Math.floor(MAX_BUTTONS / 2));
  const endPage = Math.min(totalPages, startPage + MAX_BUTTONS - 1);
  if (endPage - startPage < MAX_BUTTONS - 1) {
    startPage = Math.max(1, endPage - MAX_BUTTONS + 1);
  }

  const pageButtons: number[] = [];
  for (let i = startPage; i <= endPage; i++) pageButtons.push(i);

  // Get subcategories for expanded category from local state
  const subCategoriesForExpandedCategory = localSubCategories
    .filter((s) => s.parent_id === expandedCategoryId)
    .sort((a, b) =>
      parseFloat(b.priority.toString()) - parseFloat(a.priority.toString())
    ); // Sort by priority

  const handleEditCategory = (category: Category) => {
    setEditCategory(category);
    setCategoryModal(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setDeleteItemId(categoryId);
    setShowDialog(true);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setEditSubCategory(subCategory);
    setShowSubCategoryModal(true);
  };

  const handleDeleteSubCategory = (subCategoryId: string) => {
    setDeleteSubItemId(subCategoryId);
    setShowSubDialog(true);
  };

  const handleExpandCategory = (categoryId: string) => {
    setExpandedCategoryId(
      expandedCategoryId === categoryId ? null : categoryId,
    );
  };

  const handleConfirmDeleteCategory = () => {
    if (deleteItemId) {
      dispatch(deleteCategory(deleteItemId));
    }
    setShowDialog(false);
    setDeleteItemId(null);
  };

  const handleConfirmDeleteSubCategory = () => {
    if (deleteSubItemId) {
      dispatch(deleteSubCategory(deleteSubItemId));
    }
    setShowSubDialog(false);
    setDeleteSubItemId(null);
  };

  const handleCancelDelete = () => {
    setShowDialog(false);
    setDeleteItemId(null);
  };

  const handleCancelDeleteSub = () => {
    setShowSubDialog(false);
    setDeleteSubItemId(null);
  };

  const handleCloseCategoryModal = () => {
    setCategoryModal(false);
    setEditCategory(null);
  };

  const handleCloseSubCategoryModal = () => {
    setShowSubCategoryModal(false);
    setEditSubCategory(null);
  };

  const handleAddSubCategory = () => {
    setEditSubCategory(null);
    setShowSubCategoryModal(true);
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
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}
      {status === "failed" && (
        <div className="px-6 py-4 text-red-500">{error}</div>
      )}

      {/* Category List */}
      <div className="divide-y">
        {localCategories.map((category, index) => (
          <div key={category.id} className="group relative">
            <div
              draggable
              onDragStart={(e) => handleCategoryDragStart(e, category)}
              onDragEnd={handleCategoryDragEnd}
              onDragOver={(e) => handleCategoryDragOver(e, index)}
              onDragLeave={handleCategoryDragLeave}
              onDrop={(e) => handleCategoryDrop(e, index)}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 hover:bg-blue-50 gap-3 cursor-move transition-all duration-200 ${
                categoryDragState.dragOverIndex === index
                  ? "border-t-2 border-blue-500 bg-blue-50"
                  : ""
              } ${
                categoryDragState.isDragging &&
                categoryDragState.draggedItem?.id === category.id
                  ? "opacity-50 transform rotate-1"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Drag Handle */}
                <div className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-4 h-4" />
                </div>

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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCategory(category);
                  }}
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Edit Category"
                >
                  <Edit2 />
                </button>

                <button
                  className="text-red-600 hover:text-red-800 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.id);
                  }}
                >
                  <Trash2 />
                </button>

                <ChevronDown
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExpandCategory(category.id);
                  }}
                />
              </div>
            </div>

            {/* Expanded subcategory list */}
            {expandedCategoryId === category.id && (
              <div className="ml-14 mr-14 mt-3 space-y-2">
                {subCategoryState.status === "loading" ? (
                  <div className="px-4 py-2 text-gray-400">Loading...</div>
                ) : (
                  <>
                    {subCategoriesForExpandedCategory.length > 0 ? (
                      subCategoriesForExpandedCategory.map((sub, subIndex) => (
                        <div
                          key={sub.id}
                          draggable
                          onDragStart={(e) => handleSubDragStart(e, sub)}
                          onDragEnd={handleSubDragEnd}
                          onDragOver={(e) => handleSubDragOver(e, subIndex)}
                          onDragLeave={handleSubDragLeave}
                          onDrop={(e) => handleSubDrop(e, subIndex)}
                          className={`flex items-center justify-between px-4 py-2 rounded bg-gray-50 hover:bg-gray-100 border cursor-move transition-all duration-200 ${
                            subCategoryDragState.dragOverIndex === subIndex &&
                            subCategoryDragState.draggedItem?.parent_id === expandedCategoryId
                              ? "border-t-2 border-blue-500 bg-blue-100"
                              : ""
                          } ${
                            subCategoryDragState.isDragging &&
                            subCategoryDragState.draggedItem?.id === sub.id
                              ? "opacity-50 transform rotate-1"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                              <GripVertical className="w-4 h-4" />
                            </div>
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
                              onClick={() => handleEditSubCategory(sub)}
                            >
                              <Edit2 size={16} />
                            </button>

                            <button
                              className="text-red-600 hover:text-red-800 transition"
                              onClick={() => handleDeleteSubCategory(sub.id)}
                            >
                              <Trash2 />
                            </button>
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
                    onClick={handleAddSubCategory}
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
                  <Modal onClose={handleCloseSubCategoryModal}>
                    <SubCategoryForm
                      parentId={category.id}
                      initialData={
                        editSubCategory
                          ? {
                              name: editSubCategory.name,
                              image: editSubCategory.image,
                            }
                          : undefined
                      }
                      subCategoryId={editSubCategory?.id}
                      onClose={handleCloseSubCategoryModal}
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

      {/* Delete Category Dialog */}
      <DismissDialog
        open={showDialog}
        title="Delete Category"
        message="Are you sure you want to delete this Category?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDeleteCategory}
        onCancel={handleCancelDelete}
      />

      {/* Delete Subcategory Dialog */}
      <DismissDialog
        open={showSubDialog}
        title="Delete Subcategory"
        message="Are you sure you want to delete this Subcategory?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDeleteSubCategory}
        onCancel={handleCancelDeleteSub}
      />

      {/* Category Modal (for edit/create) */}
      {showCategoryModal && (
        <Modal onClose={handleCloseCategoryModal}>
          <CategoryForm
            initialData={
              editCategory
                ? { name: editCategory.name, image: editCategory.image }
                : undefined
            }
            categoryId={editCategory?.id}
            onClose={handleCloseCategoryModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default CategoryListSection;