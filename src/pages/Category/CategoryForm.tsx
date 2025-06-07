import { useState, useEffect } from "react";
import { useAppDispatch } from "@/hooks/reduxHooks";
import Input from "@/components/Form/Input";
import ImageInputWithURLAssetToggle from "@/components/Form/ImageInputWithUrlAssetToggle";
import { createCategory, updateCategory } from "@/slices/categorySlice";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Valid image URL required"),
});
type CategoryFormData = z.infer<typeof categorySchema>;

const defaultCategory: CategoryFormData = { name: "", image: "" };

const CategoryForm = ({
  initialData,
  categoryId,
  onClose,
}: {
  initialData?: CategoryFormData;
  categoryId?: string;
  onClose?: () => void;
}) => {
  const [form, setForm] = useState<CategoryFormData>(
    initialData || defaultCategory
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof CategoryFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

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
      let actionResult;
      if (categoryId) {
        actionResult = await dispatch(
          updateCategory({ id: categoryId, updates: {name: form.name, image:form.image} })
        );
      } else {
        actionResult = await dispatch(createCategory(form));
      }

      // Only close modal if action was successful
      if (!("error" in actionResult)) {
        onClose?.();
      }
    } catch (err) {
      alert("Error saving category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <h2 className="text-xl font-semibold text-gray-800 ml-6">
        {categoryId ? "Update Categories" : "Create Categories"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white shadow-md rounded-lg p-8"
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
            {isSubmitting
              ? categoryId
                ? "Updating..."
                : "Creating..."
              : categoryId
              ? "Update"
              : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
