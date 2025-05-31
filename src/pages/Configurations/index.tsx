import { useState } from "react";
import { z } from "zod";
import Input from "@/components/Form/Input";
import Toggle from "@/components/Form/Toggle";

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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden py-6 px-6">
      <div className="divide-y">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
          <h2 className="text-xl font-semibold text-gray-800">
            Store Configuration
          </h2>

          <Input
            label="Enter Your business name"
            value={form.storeName}
            error={errors.storeName}
            onChange={(val) => updateField("storeName", val)}
          />

          <Toggle
            label="Store status"
            checked={form.storeStatus}
            onChange={(val) => updateField("storeStatus", val)}
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

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfigurationSection;
