import { useState } from "react";
import { z } from "zod";
import Input from "@/components/Form/Input";
import ImageInputWithURLAssetToggle from "@/components/Form/ImageInputWithUrlAssetToggle";
import AddButton from "../../assets/plus.png";

// Interfaces
export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface SubCategoryFormData {
  name: string;
  image: string;
}

// Zod validation schema for category
const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Valid image URL required"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const defaultCategory: CategoryFormData = {
  name: "",
  image: "",
};

const CategoryForm = () => {
  const [form, setForm] = useState<CategoryFormData>(defaultCategory);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CategoryFormData, string>>
  >({});
  const [subCategories, setSubCategories] = useState<SubCategoryFormData[]>([]);
  const [subCategoryErrors, setSubCategoryErrors] = useState<
    Record<number, Partial<SubCategoryFormData>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof CategoryFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateSubCategory = (
    index: number,
    field: keyof SubCategoryFormData,
    value: string
  ) => {
    const updated = [...subCategories];
    updated[index][field] = value;
    setSubCategories(updated);

    setSubCategoryErrors((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: undefined },
    }));
  };

  const addSubCategory = () => {
    setSubCategories((prev) => [...prev, { name: "", image: "" }]);
  };

  const removeSubCategory = (index: number) => {
    const updated = [...subCategories];
    updated.splice(index, 1);
    setSubCategories(updated);
  };

  const validate = (): boolean => {
    const result = categorySchema.safeParse(form);
    const subErrors: Record<number, Partial<SubCategoryFormData>> = {};

    let hasSubErrors = false;
    subCategories.forEach((sc, idx) => {
      const errors: Partial<SubCategoryFormData> = {};
      if (!sc.name.trim()) {
        errors.name = "Name is required";
        hasSubErrors = true;
      }
      if (!/^https?:\/\/.+\..+/.test(sc.image)) {
        errors.image = "Valid image URL required";
        hasSubErrors = true;
      }
      if (Object.keys(errors).length) {
        subErrors[idx] = errors;
      }
    });

    setSubCategoryErrors(subErrors);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CategoryFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof CategoryFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    return !hasSubErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subCategories }),
      });

      if (!response.ok) throw new Error("Failed to create category");

      setForm(defaultCategory);
      setSubCategories([]);
      alert("Category created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Create Category
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white shadow-md rounded-lg p-8"
      >
        {/* Category Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Category Name"
            value={form.name}
            error={errors.name}
            onChange={(val) => updateField("name", val)}
          />

          <ImageInputWithURLAssetToggle
            label="Category Image"
            value={[form.image]}
            error={errors.image}
            onChange={(val) => updateField("image", val[0] || "")}
          />
        </div>

        {/* Subcategories Section */}
        <div className="border rounded-lg p-6 bg-gray-50 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Subcategories
            </h3>
            <img
              src={AddButton}
              className="h-6 w-6"
              onClick={addSubCategory}
            ></img>
          </div>

          {subCategories.map((sc, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-md p-4 bg-white relative"
            >
              <Input
                label="Subcategory Name"
                value={sc.name}
                error={subCategoryErrors[idx]?.name}
                onChange={(val) => updateSubCategory(idx, "name", val)}
              />
              <ImageInputWithURLAssetToggle
                label="Subcategory Image"
                value={[sc.image]}
                error={subCategoryErrors[idx]?.image}
                onChange={(val) =>
                  updateSubCategory(idx, "image", val[0] || "")
                }
              />
              <div className="sm:col-span-2 text-right">
                <button
                  type="button"
                  onClick={() => removeSubCategory(idx)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
