import { useState, useEffect } from "react";
import { z } from "zod";
import Input from "@/components/Form/Input";
import ImageInputWithURLAssetToggle from "@/components/Form/ImageInputWithUrlAssetToggle";

// Zod validation schema for subcategories
const subCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Valid image URL required"),
  parent_id: z.string().min(1, "Parent ID is required"),
});
type SubCategoryFormData = z.infer<typeof subCategorySchema>;

const defaultSubCategory: SubCategoryFormData = {
  name: "",
  image: "",
  parent_id: "",
};

interface SubCategoryFormProps {
  parentId: string;
  onClose?: () => void;
  initialData?: Partial<SubCategoryFormData>;
}

const SubCategoryForm = ({ parentId, onClose, initialData }: SubCategoryFormProps) => {
  const [form, setForm] = useState<SubCategoryFormData>({
    ...defaultSubCategory,
    parent_id: parentId,
    ...(initialData || {}),
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SubCategoryFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      ...(initialData || {}),
      parent_id: parentId,
    }));
  }, [parentId, initialData]);

  const updateField = (field: keyof SubCategoryFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const result = subCategorySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SubCategoryFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SubCategoryFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      // Change API endpoint to your subcategory POST endpoint!
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to create subcategory");

      setForm({ ...defaultSubCategory, parent_id: parentId });
      onClose?.();
      // Optionally: Toast/success message
    } catch (err) {
      setSubmitError("Failed to create subcategory.");
      // Optionally: set more detailed error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <h2 className="text-xl font-semibold text-gray-800 ml-6">
        {initialData ? "Edit Subcategory" : "Create Subcategory"}
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
        {submitError && <div className="text-red-500 text-sm mt-2">{submitError}</div>}
        <div className="text-right mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? (initialData ? "Updating..." : "Creating...") : initialData ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubCategoryForm;
