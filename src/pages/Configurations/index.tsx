import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  fetchConfiguration,
  updateConfiguration,
} from "@/slices/configurationSlice";
import { z } from "zod";
import Input from "@/components/Form/Input";
import Toggle from "@/components/Form/Toggle";
import { ArrowRight, ChevronDown, ChevronUp, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ImageInputWithURLAssetToggle from "@/components/Form/ImageInputWithUrlAssetToggle";
import type { AdBanner } from "@/interfaces/ad-banner";

const configurationSchema = z.object({
  phone_number: z.string().min(10, "Phone number is required"),
  whatsapp_number: z.string().min(10, "WhatsApp number is required"),
  store_status: z.boolean(),
  min_order_amount: z.number().min(0).optional(),
  delivery_charge: z.number().min(0).optional(),
  delivery_time: z.number().min(1),
  announcement_text: z.string().optional(),
  ad_banners: z
    .array(
      z.object({
        id: z.string(),
        image: z.string().url("Valid image URL required"),
        action: z.string(),
        type: z.string(),
      })
    )
    .optional(),
});

type ConfigurationFormData = z.infer<typeof configurationSchema>;

const defaultConfig: ConfigurationFormData = {
  phone_number: "",
  whatsapp_number: "",
  store_status: true,
  min_order_amount: 0,
  delivery_charge: 0,
  delivery_time: 1,
  announcement_text: "",
  ad_banners: [],
};

function generateId(): string {
  return uuidv4(); // Example: 'b8a23d0e-2f2a-4b79-a46d-4a3fdbdfd999'
}

const ConfigurationSection = () => {
  const dispatch = useAppDispatch();
  const configState = useAppSelector((state) => state.configurations);
  const navigate = useNavigate();

  const [form, setForm] = useState<ConfigurationFormData>(defaultConfig);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ConfigurationFormData, string>>
  >({});
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [adBannerOpen, setAdBannerOpen] = useState(false);

  // For ad banner add/edit UI
  const [adBannerDraft, setAdBannerDraft] = useState<{
    image: string;
    type: string;
    action: string;
  }>({ image: "", type: "", action: "" });
  const [adBannerEditIndex] = useState<number | null>(null);
  const [adBannerError, setAdBannerError] = useState<string>("");

  // Fetch config on mount
  useEffect(() => {
    dispatch(fetchConfiguration());
  }, [dispatch]);

  // Populate form from fetched config
  useEffect(() => {
    if (configState.data) {
      setForm({
        phone_number: configState.data.phone_number || "",
        whatsapp_number: configState.data.whatsapp_number || "",
        store_status: configState.data.store_status ?? true,
        min_order_amount: configState.data.min_order_amount ?? 0,
        delivery_charge: configState.data.delivery_charge ?? 0,
        delivery_time: configState.data.delivery_time ?? 1,
        announcement_text: configState.data.announcement_text || "",
        ad_banners: configState.data.ad_banners || [],
      });
    }
  }, [configState.data]);

  const handleAddBanner = () => {
    if (!adBannerDraft.image || !adBannerDraft.type) {
      setAdBannerError("Please fill all banner fields");
      return;
    }

    const newBanner: AdBanner = {
      id: generateId(),
      image: adBannerDraft.image,
      type: adBannerDraft.type,
      action: adBannerDraft.action,
    };

    setForm((f) => ({
      ...f,
      ad_banners: [...(f.ad_banners || []), newBanner],
    }));

    // Reset form for next banner
    setAdBannerDraft({ image: "", type: "", action: "" });
    setAdBannerError("");
  };

  const updateField = <K extends keyof ConfigurationFormData>(
    field: K,
    value: ConfigurationFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Ad Banner helpers
  // const resetAdBannerDraft = () =>
  //   setAdBannerDraft({ image: "", type: "", action: "" });

  // const handleAddBanner = () => {
  //   if (!adBannerDraft.image) {
  //     setAdBannerError("Both image are required");
  //     return;
  //   }
  //   if (adBannerEditIndex !== null) {
  //     // Edit mode
  //     const banners = [...(form.ad_banners || [])];
  //     banners[adBannerEditIndex] = {
  //       ...banners[adBannerEditIndex],
  //       ...adBannerDraft,
  //     };
  //     updateField("ad_banners", banners);
  //     setAdBannerEditIndex(null);
  //   } else {
  //     // Add mode
  //     updateField("ad_banners", [
  //       ...(form.ad_banners || []),
  //       { id: generateId(), ...adBannerDraft },
  //     ]);
  //   }
  //   resetAdBannerDraft();
  //   setAdBannerError("");
  // };

  const handleDeleteBanner = (index: number) => {
    const banners = (form.ad_banners || []).filter((_, i) => i !== index);
    updateField("ad_banners", banners);
  };

  const validate = (): boolean => {
    try {
      const result = configurationSchema.safeParse(form);
      if (!result.success) {
        const fieldErrors: Partial<
          Record<keyof ConfigurationFormData, string>
        > = {};
        result.error.errors.forEach((err) => {
          const field = err.path[0] as keyof ConfigurationFormData;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    } catch (e) {
      console.log(e);
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting configuration");

    if (!validate()) return;
    await dispatch(updateConfiguration(form));
    console.log("updated configuration");
  };

  if (configState.status === "loading" && !configState.data) {
    return <div>Loading...</div>;
  }
  if (configState.status === "failed") {
    return <div className="text-red-500">{configState.error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden py-6 px-6 mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Store Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="md:col-span-2">
            <Toggle
              label="Store status"
              checked={form.store_status}
              onChange={(val) => updateField("store_status", val)}
            />
          </div>
          <Input
            label="Phone No"
            value={form.phone_number}
            error={errors.phone_number}
            onChange={(val) => updateField("phone_number", val)}
          />
          <Input
            label="Whatsapp No"
            value={form.whatsapp_number}
            error={errors.whatsapp_number}
            onChange={(val) => updateField("whatsapp_number", val)}
          />
          <Input
            label="Minimum Order Amount in Rupee"
            type="number"
            value={form.min_order_amount?.toString() ?? "0"}
            onChange={(val) => updateField("min_order_amount", +val)}
          />
          <Input
            label="Delivery charge in Rupee"
            type="number"
            value={form.delivery_charge?.toString() ?? "0"}
            onChange={(val) => updateField("delivery_charge", +val)}
          />
          <Input
            label="Delivery time (in Days)"
            type="number"
            value={form.delivery_time.toString()}
            onChange={(val) => updateField("delivery_time", +val)}
          />
        </div>

        {/* Actions List */}
        <div className="pt-4 space-y-2 border-t border-gray-200 mt-6">
          {/* Announcement Accordion */}
          <button
            type="button"
            onClick={() => setAnnouncementOpen((open) => !open)}
            className="flex justify-between items-center w-full text-left px-2 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100 border-b border-gray-200"
          >
            <span>Announcement</span>
            {announcementOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {announcementOpen && (
            <div className="bg-gray-50 p-4 rounded-b">
              <Input
                label="Announcement Text"
                value={form.announcement_text || ""}
                onChange={(val) => updateField("announcement_text", val)}
              />
            </div>
          )}

          {/* Ad Banner Accordion */}
          <button
            type="button"
            onClick={() => setAdBannerOpen((open) => !open)}
            className="flex justify-between items-center w-full text-left px-2 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100 border-b border-gray-200"
          >
            <span>Ad Banner</span>
            {adBannerOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {adBannerOpen && (
            <div className="bg-gray-50 p-4 rounded-b">
              <div className="mb-4">
                {(form.ad_banners || []).map((banner, idx) => (
                  <div
                    key={banner.id}
                    className="flex items-center gap-4 bg-white shadow p-2 rounded mb-2"
                  >
                    <img
                      src={banner.image}
                      alt="Banner"
                      className="w-16 h-10 object-cover rounded"
                    />
                    <span className="flex-1">{banner.action}</span>
                    <span className="text-xs text-gray-500">{banner.type}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleDeleteBanner(idx)}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Banner Add/Edit Form */}
              <div className="flex flex-col md:flex-row gap-2 items-center">
                {/* ⬇ Image Upload */}
                <ImageInputWithURLAssetToggle
                  label="Banner Image"
                  value={[adBannerDraft.image]}
                  onChange={(val) =>
                    setAdBannerDraft((d) => ({ ...d, image: val[0] || "" }))
                  }
                />

                {/* ⬇ Dropdown for type */}
                <select
                  value={adBannerDraft.type}
                  onChange={(e) =>
                    setAdBannerDraft((d) => ({ ...d, type: e.target.value }))
                  }
                  className="px-3 py-2 border rounded text-sm"
                >
                  <option value="">Select Screen</option>
                  <option value="home">HOME</option>
                  <option value="category">CATEGORY</option>
                  <option value="mobileHome">MOBILE HOME</option>
                  <option value="mobileCategory">MOBILE CATEGORY</option>
                </select>

                {/* ⬇ Submit */}
                <div className="flex h-full flex-col self-end">
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded hover:bg-blue-700 flex items-center gap-1"
                    onClick={handleAddBanner}
                  >
                    {adBannerEditIndex !== null ? "Update" : "Add"}
                  </button>
                </div>
              </div>

              {adBannerError && (
                <div className="text-red-500 text-xs mt-2">{adBannerError}</div>
              )}
            </div>
          )}

          {/* Offers Navigation */}
          <button
            type="button"
            onClick={() => navigate("/offers")}
            className="flex justify-between items-center w-full text-left px-2 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100 border-b border-gray-200"
          >
            <span>Offers</span>
            <ArrowRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigurationSection;
