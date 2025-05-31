import React, { useState, useRef } from "react";

interface Props {
  label: string;
  value: string[];
  error?: string;
  onChange: (val: string[]) => void;
}

const ImageInputWithURLAssetToggle: React.FC<Props> = ({
  label,
  value,
  error,
  onChange,
}) => {
  const [useUrl, setUseUrl] = useState(true);
  const [url, setUrl] = useState(value.join(","));
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (val: string) => {
    setUrl(val);
    onChange(val.split(",").map((s) => s.trim()));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const selectedFiles = Array.from(files);
    const filePreviews = selectedFiles.map((f) => URL.createObjectURL(f));
    onChange(filePreviews);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="space-y-1 w-full">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex gap-3 text-sm mb-2">
        <button
          type="button"
          onClick={() => setUseUrl(true)}
          className={`px-2 py-1 rounded ${
            useUrl
              ? "bg-indigo-100 text-indigo-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Use URL
        </button>
        <button
          type="button"
          onClick={() => setUseUrl(false)}
          className={`px-2 py-1 rounded ${
            !useUrl
              ? "bg-indigo-100 text-indigo-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Upload File
        </button>
      </div>

      {useUrl ? (
        <input
          type="text"
          value={url}
          placeholder="Comma separated image URLs"
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 border-gray-200"
        />
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-full px-4 py-10 border-2 border-dashed rounded-md text-center text-sm cursor-pointer transition ${
            dragActive
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-gray-300 bg-gray-50 text-gray-500 hover:border-indigo-400"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            ref={inputRef}
          />
          <p>
            Drag & drop image files here or{" "}
            <span className="text-indigo-600 underline">browse</span>
          </p>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default ImageInputWithURLAssetToggle;
