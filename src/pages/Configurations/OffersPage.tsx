import { useState } from "react";
import { z } from "zod";
import Input from "@/components/Form/Input";
import TextArea from "@/components/Form/TextArea";
import Toggle from "@/components/Form/Toggle";
import { useNavigate } from "react-router";
import BackArrow from "../../assets/arrow.png";

// --- Schema & Types ---
export interface Offer {
  code: string;
  description: string;
  discount_type: string;
  discount_value: string;
  min_discount_value: string;
  max_discount_value: string;
  min_order_value: string;
  offer_type: string;
  offer_per_user: boolean;
  offer_status: boolean;
  start_date: Date;
  end_date: Date;
}

const defaultOffer: Offer = {
  code: "",
  description: "",
  discount_type: "PERCENTAGE", // or "FLAT"
  discount_value: "",
  min_discount_value: "",
  max_discount_value: "",
  min_order_value: "",
  offer_type: "NEW_USER", // or "ALL_USER", etc.
  offer_per_user: false,
  offer_status: true,
  start_date: new Date(),
  end_date: new Date(),
};

const offerSchema = z.object({
  code: z.string().min(1, "Code is required"),
  description: z.string().min(1, "Description is required"),
  discount_type: z.string(),
  discount_value: z.string().min(1),
  min_discount_value: z.string().min(1),
  max_discount_value: z.string().min(1),
  min_order_value: z.string().min(1),
  offer_type: z.string(),
  offer_per_user: z.boolean(),
  offer_status: z.boolean(),
  start_date: z.date(),
  end_date: z.date(),
});

const OffersPage = () => {
  const [form, setForm] = useState<Offer>(defaultOffer);
  const [errors, setErrors] = useState<Partial<Record<keyof Offer, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const updateField = <K extends keyof Offer>(field: K, value: Offer[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = offerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof Offer, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof Offer;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // simulate API
      await new Promise((res) => setTimeout(res, 1000));
      alert("Offer submitted!");
    } catch (error) {
      console.error("Error submitting offer", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        {/* Header with back */}
        <div className="flex items-center mb-1">
          <img
            src={BackArrow}
            alt="Back"
            className="w-6 h-6 mr-2 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h2 className="text-2xl font-semibold text-gray-800">Create Offer</h2>
        </div>
        <p className="text-sm text-gray-500 ml-8">
          Fill in the offer details and conditions.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-md p-6 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Offer Code"
            value={form.code}
            error={errors.code}
            onChange={(val) => updateField("code", val)}
          />
          <Input
            label="Discount Type (PERCENTAGE or FLAT)"
            value={form.discount_type}
            onChange={(val) => updateField("discount_type", val)}
          />
          <Input
            label="Discount Value"
            value={form.discount_value}
            error={errors.discount_value}
            onChange={(val) => updateField("discount_value", val)}
          />
          <Input
            label="Min Discount Value"
            value={form.min_discount_value}
            error={errors.min_discount_value}
            onChange={(val) => updateField("min_discount_value", val)}
          />
          <Input
            label="Max Discount Value"
            value={form.max_discount_value}
            error={errors.max_discount_value}
            onChange={(val) => updateField("max_discount_value", val)}
          />
          <Input
            label="Min Order Value"
            value={form.min_order_value}
            error={errors.min_order_value}
            onChange={(val) => updateField("min_order_value", val)}
          />
          <Input
            label="Offer Type"
            value={form.offer_type}
            onChange={(val) => updateField("offer_type", val)}
          />
          <Input
            label="Start Date"
            type="date"
            value={form.start_date.toISOString().split("T")[0]}
            onChange={(val) => updateField("start_date", new Date(val))}
          />
          <Input
            label="End Date"
            type="date"
            value={form.end_date.toISOString().split("T")[0]}
            onChange={(val) => updateField("end_date", new Date(val))}
          />
        </div>

        <TextArea
          label="Description"
          value={form.description}
          error={errors.description}
          onChange={(val) => updateField("description", val)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Toggle
            label="Limit one offer per user"
            checked={form.offer_per_user}
            onChange={(val) => updateField("offer_per_user", val)}
          />
          <Toggle
            label="Offer Status"
            checked={form.offer_status}
            onChange={(val) => updateField("offer_status", val)}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Offer"}
        </button>
      </div>
    </form>
  );
};

export default OffersPage;
