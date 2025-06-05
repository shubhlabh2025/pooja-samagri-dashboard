import { useState } from "react";
import { z } from "zod";
import ImageInputWithURLAssetToggle from "@/components/Form/ImageInputWithUrlAssetToggle";

// Zod validation schema
const adBannerSchema = z.object({
  image: z.array(z.string()).min(1, "At least one image is required"),
});

type AdBannerFormData = z.infer<typeof adBannerSchema>;

const defaultForm: AdBannerFormData = {
  image: [],
};

const AdBannerForm = () => {
  const [form, setForm] = useState<AdBannerFormData>(defaultForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof AdBannerFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof AdBannerFormData>(
    field: K,
    value: AdBannerFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = adBannerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AdBannerFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof AdBannerFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1000));
      alert("Ad banner submitted successfully!");
      setForm(defaultForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <h2 className="text-xl font-semibold text-gray-800 ml-6">
        Create Ad Banner
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow-md rounded-lg p-8"
      >
        <div className="flex flex-col gap-6">
          <ImageInputWithURLAssetToggle
            label="Add Images"
            value={form.image}
            error={errors.image}
            onChange={(val) => updateField("image", val)}
          />
        </div>

        <div className="text-right mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdBannerForm;
