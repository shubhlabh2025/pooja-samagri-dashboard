import { useState, useEffect } from "react";
import { z } from "zod";
import Input from "@/components/Form/Input";
import TextArea from "@/components/Form/TextArea";
import Toggle from "@/components/Form/Toggle";
import { useNavigate, useParams } from "react-router";
import BackArrow from "../../assets/arrow.png";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  fetchCouponById,
  updateCoupon,
  clearSelectedCoupon,
  selectSelectedCoupon,
  selectCouponLoading,
  selectCouponError,
} from "@/slices/offerSlice";
import { toast, ToastContainer } from "react-toastify";
import type { UpdateCoupon } from "@/interfaces/coupon";
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
  start_date: new Date().toISOString(),
  end_date: new Date().toISOString(),
};

const offerSchema = z
  .object({
    code: z.string().min(1, "Code is required"),
    description: z.string().min(1, "Description is required"),
    discount_type: z.enum(["percentage", "fixed"]),
    discount_value: z.string().min(1, "Discount value is required"),
    min_discount_value: z.string(),
    max_discount_value: z.string(),
    min_order_value: z.string().min(1, "Min order value is required"),
    offer_type: z.enum(["NEW_USER", "ALL_USER"]),
    offer_per_user: z.boolean(),
    offer_status: z.boolean(),
    start_date: z.string(),
    end_date: z.string(),
  })
  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true;
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end > start;
    },
    {
      message: "End date must be greater than start date",
      path: ["end_date"],
    }
  );

const UpdateOfferPage = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get data from Redux store using selectors
  const selectedCoupon = useAppSelector(selectSelectedCoupon);
  const loading = useAppSelector(selectCouponLoading);
  const error = useAppSelector(selectCouponError);

  const [form, setForm] = useState<Offer>(defaultOffer);
  const [errors, setErrors] = useState<Partial<Record<keyof Offer, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Clear selected coupon on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearSelectedCoupon());
    };
  }, [dispatch]);

  // Fetch coupon data when component mounts
  useEffect(() => {
    if (offerId && !selectedCoupon && !loading) {
      dispatch(fetchCouponById(offerId));
    }
  }, [dispatch, offerId, selectedCoupon, loading]);

  // Populate form when coupon data is available
  useEffect(() => {
    if (selectedCoupon && !dataLoaded) {
      console.log("Selected Coupon Data:", selectedCoupon); // Debug log
      console.log(selectedCoupon.discount_type);
      const mappedForm: Offer = {
        code: selectedCoupon.offer_code || "",
        description: selectedCoupon.description || "",
        discount_type: selectedCoupon.discount_type || "percentage",
        discount_value: selectedCoupon.discount_value?.toString() || "",
        min_discount_value: selectedCoupon.min_discount_value?.toString() || "",
        max_discount_value: selectedCoupon.max_discount_value?.toString() || "",
        min_order_value: (selectedCoupon.min_order_value ?? 0).toString(),
        // Handle missing fields with defaults
        offer_type: (selectedCoupon as any).offer_type || "NEW_USER",
        offer_per_user:
          (selectedCoupon as any).offer_per_user ||
          (selectedCoupon as any).usage_limit_per_user !== null ||
          false,
        offer_status:
          selectedCoupon.is_active !== undefined
            ? selectedCoupon.is_active
            : true,
        start_date: selectedCoupon.start_date || new Date().toISOString(),
        end_date: selectedCoupon.end_date || new Date().toISOString(),
      };

      console.log("Mapped Form Data:", mappedForm); // Debug log

      setForm(mappedForm);
      setIsFixed(mappedForm.discount_type === "fixed");
      setDataLoaded(true);
    }
  }, [selectedCoupon, dataLoaded]);

  // Handle errors from Redux
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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

  const validate = (): boolean => {
    const result = offerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof Offer, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof Offer;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!offerId) {
      toast.error("Offer ID is missing");
      return;
    }

    const mapFormToUpdateCoupon = (form: Offer): UpdateCoupon => ({
      discount_type: form.discount_type,
      discount_value: +form.discount_value,
      min_discount_value:
        form.discount_type === "percentage"
          ? +form.min_discount_value
          : undefined,
      max_discount_value:
        form.discount_type === "percentage"
          ? +form.max_discount_value
          : undefined,
      start_date: form.start_date,
      end_date: form.end_date,
      is_active: form.offer_status,
      description: form.description,
      min_order_value: +form.min_order_value,
    });

    console.log("submit");
    console.log(form);
    console.log(mapFormToUpdateCoupon);

    setIsSubmitting(true);
    try {
      await dispatch(
        updateCoupon({
          id: offerId,
          updates: mapFormToUpdateCoupon(form),
        })
      ).unwrap();

      toast.success("Offer updated successfully");

      // Navigate back after a short delay
      setTimeout(() => navigate("/offers"), 1000);
    } catch (error) {
      console.error("Error updating offer", error);
      toast.error("Failed to update offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading && !dataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading offer data...</div>
      </div>
    );
  }

  // Error state - offer not found
  if (!selectedCoupon && !loading && offerId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Offer not found</div>
          <button
            onClick={() => navigate("/offers")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Offers
          </button>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-semibold text-gray-800">Update Offer</h2>
        </div>
        <p className="text-sm text-gray-500 ml-8">
          Update the offer details and conditions.
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

      <div className="bg-white border border-gray-100 rounded-md p-6 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Toggle
            label="Offer Status"
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
            disabled={true}
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
              disabled={true}
              onChange={(e) => {
                updateField(
                  "discount_type",
                  e.target.value as Offer["discount_type"]
                );
                setIsFixed(e.target.value === "fixed");
              }}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
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
              <option value="NEW_USER">New User</option>
              <option value="ALL_USER">All Users</option>
            </select>
          </div>
          <DateTimePicker
            dateLabel="Start Date"
            timeLabel="Start Time"
            value={form.start_date}
            error={errors.start_date}
            onChange={(combinedDateTime) => {
              updateField("start_date", combinedDateTime ?? "");
            }}
          />
          <DateTimePicker
            dateLabel="End Date"
            timeLabel="End Time"
            value={form.end_date}
            error={errors.end_date}
            onChange={(combinedDateTime) => {
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
        {isSubmitting ? "Updating..." : "Update Offer"}
      </button>
    </form>
  );
};

export default UpdateOfferPage;
