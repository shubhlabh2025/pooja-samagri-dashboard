import React, { useState, useRef } from "react";

interface Props {
  label: string;
  value: string[];
  error?: string;
  onChange: (val: string[]) => void;
}

interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
}

const ImageUploadComponent: React.FC<Props> = ({
  label,
  value,
  error,
  onChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/api/assets/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data: UploadResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Upload failed");
    }

    return data.data.url;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress("");

    try {
      const selectedFiles = Array.from(files);
      const uploadPromises = selectedFiles.map(async (file, index) => {
        setUploadProgress(
          `Uploading ${index + 1} of ${selectedFiles.length}...`,
        );
        return await uploadFile(file);
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Combine with existing URLs if any
      const currentUrls = value.filter(Boolean);
      const newUrls = [...currentUrls, ...uploadedUrls];

      onChange(newUrls);
      setUploadProgress(`Successfully uploaded ${uploadedUrls.length} file(s)`);

      // Clear progress message after 3 seconds
      setTimeout(() => setUploadProgress(""), 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );

      // Clear error message after 5 seconds
      setTimeout(() => setUploadProgress(""), 5000);
    } finally {
      setUploading(false);
    }
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

  const removeImage = (indexToRemove: number) => {
    const newUrls = value.filter((_, index) => index !== indexToRemove);
    onChange(newUrls);
  };

  return (
    <div className="space-y-1 w-full">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`w-full px-4 py-10 border-2 border-dashed rounded-md text-center text-sm cursor-pointer transition ${
          dragActive
            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
            : uploading
              ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
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
          disabled={uploading}
        />
        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-indigo-600">Uploading files...</p>
          </div>
        ) : (
          <p>
            Drag & drop image files here or{" "}
            <span className="text-indigo-600 underline">browse</span>
          </p>
        )}
      </div>

      {/* Upload Progress/Status */}
      {uploadProgress && (
        <p
          className={`text-xs mt-1 ${
            uploadProgress.includes("failed") ||
            uploadProgress.includes("error")
              ? "text-red-500"
              : uploadProgress.includes("Successfully")
                ? "text-green-500"
                : "text-blue-500"
          }`}
        >
          {uploadProgress}
        </p>
      )}

      {/* Image Preview */}
      {value.filter(Boolean).length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-600 mb-2">Selected Images:</p>
          <div className="flex flex-wrap gap-2">
            {value.filter(Boolean).map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Preview ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMSAyMUg0M1Y0M0gyMVYyMVoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTI2IDI4QzI3LjY1NjkgMjggMjkgMjYuNjU2OSAyOSAyNUMyOSAyMy4zNDMxIDI3LjY1NjkgMjIgMjYgMjJDMjQuMzQzMSAyMiAyMyAyMy4zNDMxIDIzIDI1QzIzIDI2LjY1NjkgMjQuMzQzMSAyOCAyNiAyOFoiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+Cg==";
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default ImageUploadComponent;
