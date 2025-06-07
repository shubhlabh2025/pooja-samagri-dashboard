import React from "react";
import { X, Plus } from "lucide-react";

interface CategoriesChipSelectorProps {
  categories: { id: string; name: string }[];
  onRemove: (id: string) => void;
  onAdd: () => void;
}

const CategoriesChipSelector: React.FC<CategoriesChipSelectorProps> = ({
  categories,
  onRemove,
  onAdd,
}) => (
  <div className="flex items-center flex-wrap gap-2 mb-2">
    {categories.map((cat) => (
      <span
        key={cat.id}
        className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold"
      >
        {cat.name}
        <button
          onClick={() => onRemove(cat.id)}
          className="ml-1 rounded hover:bg-blue-200 p-1"
          type="button"
        >
          <X size={14} />
        </button>
      </span>
    ))}
    <button
      type="button"
      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold hover:bg-blue-200"
      onClick={onAdd}
    >
      <Plus size={14} className="mr-1" /> Add Categories
    </button>
  </div>
);

export default CategoriesChipSelector;
