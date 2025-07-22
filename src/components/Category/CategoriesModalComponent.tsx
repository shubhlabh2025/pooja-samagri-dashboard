import React, { useState, useEffect, useRef } from "react";
import Modal from "../Common/Modal";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchCategories } from "@/slices/categorySlice";

interface CategoriesModalProps {
  open: boolean;
  onClose: () => void;
  selectedCategoryIds: string[];
  onSave: (ids: string[]) => void;
}

const PAGE_SIZE = 50;
const DEBOUNCE_MS = 200;

const CategoriesModal: React.FC<CategoriesModalProps> = ({
  open,
  onClose,
  selectedCategoryIds,
  onSave,
}) => {
  const dispatch = useAppDispatch();
  const { categories, pagination, status } = useAppSelector(
    (state) => state.categories,
  );
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedCategoryIds);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      dispatch(fetchCategories({ page, pageSize: PAGE_SIZE, q: query }));
    }
  }, [dispatch, page, query, open]);

  useEffect(() => {
    if (open) setSelectedIds(selectedCategoryIds);
  }, [open, selectedCategoryIds]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchText.trim());
      setPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Focus input on open
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  if (!open) return null;
  return (
    <Modal onClose={onClose}>
      <div className="max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-gray-800">
            Select Categories
          </div>
        </div>
        <div className="flex mb-3 gap-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-3 py-2 border border-gray-200 rounded focus:outline-none"
            placeholder="Search categories"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="bg-gray-200 px-3 rounded"
            >
              Clear
            </button>
          )}
        </div>
        <div className="max-h-64 overflow-auto">
          {status === "loading" && <div>Loading...</div>}
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(cat.id)}
                onChange={(e) => {
                  setSelectedIds((prev) =>
                    e.target.checked
                      ? [...prev, cat.id]
                      : prev.filter((id) => id !== cat.id),
                  );
                }}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            {pagination && pagination.totalPages > 1 && (
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-2 py-1 rounded ${
                      page === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page === pagination.totalPages}
                  className="px-2 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ml-4"
            onClick={() => onSave(selectedIds)}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CategoriesModal;
