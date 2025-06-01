import { useState } from "react";
import { z } from "zod";
import Input from "@/components/Form/Input";

// Zod validation schema
const announcementSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

const defaultForm: AnnouncementFormData = {
  name: "",
};

const AnnouncementForm = () => {
  const [form, setForm] = useState<AnnouncementFormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof AnnouncementFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof AnnouncementFormData>(field: K, value: AnnouncementFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = announcementSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AnnouncementFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof AnnouncementFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1000));
      alert("Announcement created: " + form.name);
      setForm(defaultForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <h2 className="text-2xl font-semibold text-gray-800 ml-6"> </h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-8">
        <div className="flex flex-col gap-6">
          <Input
            label="Announcement Text"
            value={form.name}
            error={errors.name}
            onChange={(val) => updateField("name", val)}
          />
        </div>

        <div className="text-right mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;
