import { useState, useEffect } from "react";
import { useAppDispatch } from "@/hooks/reduxHooks";
import Input from "@/components/Form/Input";
import ImageInputWithURLAssetToggle from "@/components/Form/ImageInputWithUrlAssetToggle";
import {
  createSubCategory,
  updateSubCategory,
} from "@/slices/subCategorySlice";
import { z } from "zod";

// Zod schema for subcategory
const subCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Valid image URL required"),
});

type SubCategoryFormData = z.infer<typeof subCategorySchema>;

const defaultSubCategory: SubCategoryFormData = { name: "", image: "" };

const SubCategoryForm = ({
  parentId,
  initialData,
  subCategoryId,
  onClose,
}: {
  parentId: string;
  initialData?: SubCategoryFormData;
  subCategoryId?: string;
  onClose?: () => void;
}) => {
  const [form, setForm] = useState<SubCategoryFormData>(
    initialData || defaultSubCategory
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof SubCategoryFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm(defaultSubCategory);
  }, [initialData]);

  const updateField = (field: keyof SubCategoryFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const result = subCategorySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SubCategoryFormData, string>> =
        {};
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
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      let actionResult;
      if (subCategoryId) {
        actionResult = await dispatch(
          updateSubCategory({
            id: subCategoryId,
            updates: {
              name: form.name,
              image: form.image,
            },
          })
        );
      } else {
        actionResult = await dispatch(
          createSubCategory({ ...form, parent_id: parentId })
        );
      }
      if (!("error" in actionResult)) {
        onClose?.();
      }
    } catch (err) {
      alert("Error saving subcategory.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <h2 className="text-xl font-semibold text-gray-800 ml-6">
        {subCategoryId ? "Update Subcategory" : "Create Subcategory"}
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
              ? subCategoryId
                ? "Updating..."
                : "Creating..."
              : subCategoryId
              ? "Update"
              : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubCategoryForm;
