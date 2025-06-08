import Input from "@/components/Form/Input";
import { useEffect, useState } from "react";

// Placeholder AdBannerForm component (implement your own or import)
const AdBannerForm = ({ value, onChange }: { value: string[]; onChange: (val: string[]) => void }) => {
  const [urls, setUrls] = useState<string[]>(value);

  const handleChange = (idx: number, url: string) => {
    const updated = [...urls];
    updated[idx] = url;
    setUrls(updated);
    onChange(updated);
  };

  const handleAdd = () => {
    setUrls([...urls, ""]);
  };

  const handleRemove = (idx: number) => {
    const updated = urls.filter((_, i) => i !== idx);
    setUrls(updated);
    onChange(updated);
  };

  useEffect(() => {
    setUrls(value);
  }, [value]);

  return (
    <div className="space-y-2">
      {urls.map((url, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            label={`Banner URL #${idx + 1}`}
            value={url}
            onChange={(val) => handleChange(idx, val)}
          />
          <button type="button" onClick={() => handleRemove(idx)} className="text-red-500 px-2">
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="bg-gray-200 px-3 py-1 rounded text-sm"
        onClick={handleAdd}
      >
        + Add Banner
      </button>
    </div>
  );
};