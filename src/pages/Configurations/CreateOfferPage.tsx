import { useState } from "react";
import { z } from "zod";
import Input from "@/components/Form/Input";
import TextArea from "@/components/Form/TextArea";
import Toggle from "@/components/Form/Toggle";
import { useNavigate } from "react-router";
import BackArrow from "../../assets/arrow.png";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { createCoupon } from "@/slices/offerSlice";
import { toast, ToastContainer } from "react-toastify";
import type { CreateCoupon } from "@/interfaces/coupon";
import { DateTimePicker } from "@/components/Common/DateTimePicker";

// --- Schema & Types ---
export interface Offer {
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  min_discount_value: string;
  max_discount_value: string;
  min_order_value: string;
  offer_type: "NEW_USER" | "ALL_USER";
  offer_per_user: boolean;
  offer_status: boolean;
  start_date: string;
  end_date: string;
}
const now = new Date();
// const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +1 day

const defaultOffer: Offer = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: "",
  min_discount_value: "",
  max_discount_value: "",
  min_order_value: "",
  offer_type: "NEW_USER",
  offer_per_user: false,
  offer_status: true,
  start_date: now.toISOString(),
  end_date: now.toISOString(),
};

const offerSchema = z
  .object({
    code: z.string().min(1, "Code is required"),
    description: z.string().min(1, "Description is required"),
    discount_type: z.enum(["percentage", "fixed"]),
    discount_value: z.string().min(1),
    min_discount_value: z.string(),
    max_discount_value: z.string(),
    min_order_value: z.string().min(1),
    offer_type: z.enum(["NEW_USER", "ALL_USER"]),
    offer_per_user: z.boolean(),
    offer_status: z.boolean(),
    start_date: z.string(),
    end_date: z.string(),
  })
  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true; // skip if either is empty
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end > start;
    },
    {
      message: "End date must be greater than start date",
      path: ["end_date"], // Attach error to `end_date` field
    },
  );
const CreateOfferPage = () => {
  const [form, setForm] = useState<Offer>(defaultOffer);
  const [errors, setErrors] = useState<Partial<Record<keyof Offer, string>>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const updateField = <K extends keyof Offer>(field: K, value: Offer[K]) => {
    const newForm = { ...form, [field]: value };

    // Auto-set min/max if FIXED
    if (field === "discount_type" && value === "fixed") {
      newForm.min_discount_value = form.discount_value;
      newForm.max_discount_value = form.discount_value;
    }

    setForm(newForm);
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

    const mapFormToCreateCoupon = (form: Offer): CreateCoupon => ({
      offer_code: form.code,
      discount_type: form.discount_type === "fixed" ? "fixed" : "percentage",
      discount_value: +form.discount_value,
      min_discount_value:
        form.discount_type === "percentage"
          ? +form.min_discount_value
          : undefined,
      max_discount_value:
        form.discount_type === "percentage"
          ? +form.max_discount_value
          : undefined,
      min_order_value: +form.min_order_value,
      start_date: form.start_date,
      end_date: form.end_date,
      is_active: form.offer_status,
      description: form.description,
    });

    setIsSubmitting(true);
    try {
      await dispatch(createCoupon(mapFormToCreateCoupon(form)));

      toast.success("Variant updated successfully");

      // Navigate back after a short delay (optional)
      setTimeout(() => navigate("/offers"), 1000);
    } catch (error) {
      console.error("Error submitting offer", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div>
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Toggles at top */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
      </div> */}

      <div className="bg-white border border-gray-100 rounded-md p-6 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Toggle
            label="Offer Active"
            checked={form.offer_status}
            onChange={(val) => updateField("offer_status", val)}
          />
          <Toggle
            label="Limit one offer per user"
            checked={form.offer_per_user}
            onChange={(val) => updateField("offer_per_user", val)}
          />
          <Input
            label="Offer Code"
            value={form.code}
            error={errors.code}
            onChange={(val) => updateField("code", val)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none"
              value={form.discount_type}
              onChange={(e) => {
                updateField(
                  "discount_type",
                  e.target.value as Offer["discount_type"],
                );
                console.log("offer type");
                console.log(e.target.value);
                if (e.target.value === "fixed") {
                  setIsFixed(true);
                } else {
                  setIsFixed(false);
                }
              }}
            >
              <option value="percentage">percentage</option>
              <option value="fixed">fixed</option>
            </select>
          </div>
          <Input
            label="Discount Value"
            type="number"
            value={form.discount_value}
            error={errors.discount_value}
            onChange={(val) => updateField("discount_value", val)}
          />
          <Input
            label="Min Discount Value"
            type="number"
            value={form.min_discount_value}
            disabled={isFixed}
            error={errors.min_discount_value}
            onChange={(val) => updateField("min_discount_value", val)}
          />
          <Input
            label="Max Discount Value"
            type="number"
            value={form.max_discount_value}
            disabled={isFixed}
            error={errors.max_discount_value}
            onChange={(val) => updateField("max_discount_value", val)}
          />
          <Input
            label="Min Order Value"
            type="number"
            value={form.min_order_value}
            error={errors.min_order_value}
            onChange={(val) => updateField("min_order_value", val)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none"
              value={form.offer_type}
              onChange={(e) =>
                updateField("offer_type", e.target.value as Offer["offer_type"])
              }
            >
              <option value="NEW_USER">NEW_USER</option>
              <option value="ALL_USER">ALL_USER</option>
            </select>
          </div>
          <DateTimePicker
            dateLabel="Start Date"
            timeLabel="Start Time"
            value={form.start_date}
            error={errors.start_date}
            onChange={(combinedDateTime) => {
              console.log("ISO:", combinedDateTime); // e.g. 2025-06-20T10:30:00.000Z
              updateField("start_date", combinedDateTime ?? "");
            }}
          />{" "}
          <DateTimePicker
            dateLabel="End Date"
            timeLabel="End Time"
            value={form.end_date}
            error={errors.end_date}
            onChange={(combinedDateTime) => {
              console.log("ISO:", combinedDateTime); // e.g. 2025-06-20T10:30:00.000Z
              updateField("end_date", combinedDateTime ?? "");
            }}
          />
        </div>

        <TextArea
          label="Description"
          value={form.description}
          error={errors.description}
          onChange={(val) => updateField("description", val)}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Offer"}
      </button>
    </form>
  );
};

export default CreateOfferPage;
