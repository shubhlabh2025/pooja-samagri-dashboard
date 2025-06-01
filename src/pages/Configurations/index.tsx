import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import Input from "@/components/Form/Input";
import Toggle from "@/components/Form/Toggle";
import { ArrowRight } from "lucide-react";
import AnnouncemntForm from "./AnnouncemntForm";
import Modal from "@/components/Common/Modal";
import AdBannerForm from "./AdBannerForm";

// Zod Schema
const configSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeStatus: z.boolean(),
  category: z.string().min(1, "Category is required"),
  phone: z.string().min(10, "Phone number is required"),
  whatsapp: z.string().min(10, "WhatsApp number is required"),
  location: z.string().min(1, "Location is required"),
  radius: z.number().min(1, "Radius must be at least 1"),
  minOrder: z.number().min(0),
  deliveryCharge: z.number().min(0),
  deliveryTime: z.number().min(1),
});

type ConfigFormData = z.infer<typeof configSchema>;

const defaultConfig: ConfigFormData = {
  storeName: "",
  storeStatus: true,
  category: "",
  phone: "",
  whatsapp: "",
  location: "",
  radius: 0,
  minOrder: 0,
  deliveryCharge: 0,
  deliveryTime: 0,
};

const ConfigurationSection = () => {
  const [form, setForm] = useState<ConfigFormData>(defaultConfig);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ConfigFormData, string>>
  >({});
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showAdBannerModal, setAdBannerModal] = useState(false);
  const navigate = useNavigate();

  const updateField = <K extends keyof ConfigFormData>(
    field: K,
    value: ConfigFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const result = configSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ConfigFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ConfigFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    alert("Configuration saved!");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden py-6 px-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
          <h2 className="text-xl font-semibold text-gray-800">
            Store Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Input
              label="Enter Your business name"
              value={form.storeName}
              error={errors.storeName}
              onChange={(val) => updateField("storeName", val)}
            />

            <Input
              label="Phone No"
              value={form.phone}
              error={errors.phone}
              onChange={(val) => updateField("phone", val)}
            />

            <Input
              label="Whatsapp No"
              value={form.whatsapp}
              error={errors.whatsapp}
              onChange={(val) => updateField("whatsapp", val)}
            />

            <Input
              label="Store Location"
              value={form.location}
              error={errors.location}
              onChange={(val) => updateField("location", val)}
            />

            <Input
              label="Serving Radius (KM)"
              type="number"
              value={form.radius.toString()}
              error={errors.radius}
              onChange={(val) => updateField("radius", +val)}
            />

            <Input
              label="Minimum Order Amount in Rupee"
              type="number"
              value={form.minOrder.toString()}
              onChange={(val) => updateField("minOrder", +val)}
            />

            <Input
              label="Delivery charge in Rupee"
              type="number"
              value={form.deliveryCharge.toString()}
              onChange={(val) => updateField("deliveryCharge", +val)}
            />

            <Input
              label="Delivery time (in Hr)"
              type="number"
              value={form.deliveryTime.toString()}
              onChange={(val) => updateField("deliveryTime", +val)}
            />

            <div className="md:col-span-2">
              <Toggle
                label="Store status"
                checked={form.storeStatus}
                onChange={(val) => updateField("storeStatus", val)}
              />
            </div>
          </div>

          {/* Actions List */}
          <div className="pt-4 space-y-2 border-t border-gray-200 mt-6">
            {[
              {
                label: "Announcement",
                onClick: () => setShowAnnouncementModal(true),
              },
              {
                label: "Ad Banner",
                onClick: () => setAdBannerModal(true),
              },
              {
                label: "Offers",
                onClick: () => navigate("/offers"),
              },
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={item.onClick}
                className="flex justify-between items-center w-full text-left px-2 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100 border-b border-gray-200"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </button>
            ))}
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <Modal onClose={() => setShowAnnouncementModal(false)}>
          <AnnouncemntForm />
        </Modal>
      )}

      {showAdBannerModal && (
         <Modal onClose={() => setAdBannerModal(false)}>
          <AdBannerForm />
        </Modal>
      )}
    </>
  );
};

export default ConfigurationSection;
