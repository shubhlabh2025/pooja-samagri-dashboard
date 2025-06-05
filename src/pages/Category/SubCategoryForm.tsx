import { useState } from "react";
import { z } from "zod";
import Input from "@/components/Form/Input";
import ImageInputWithURLAssetToggle from "@/components/Form/ImageInputWithUrlAssetToggle";

// Interfaces
export interface Category {
  id: number;
  name: string;
  image: string;
}

// Zod validation schema
const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Valid image URL required"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const defaultCategory: CategoryFormData = {
  name: "",
  image: "",
};

const SubCategoryForm = () => {
  const [form, setForm] = useState<CategoryFormData>(defaultCategory);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CategoryFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof CategoryFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const result = categorySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CategoryFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof CategoryFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to create category");

      setForm(defaultCategory);
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
      <h2 className="text-xl font-semibold text-gray-800 ml-6">
        Create Sub Categories
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y- bg-white shadow-md rounded-lg p-8"
      >
        <div className="flex flex-col gap-6">
          <Input
            label="Name"
            value={form.name}
            error={errors.name}
            onChange={(val) => updateField("name", val)}
          />

          <ImageInputWithURLAssetToggle
            label="Image"
            value={[form.image]}
            error={errors.image}
            onChange={(val) => updateField("image", val[0] || "")}
          />
        </div>

        <div className="text-right mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubCategoryForm;
