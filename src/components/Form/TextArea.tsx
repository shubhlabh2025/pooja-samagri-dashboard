import React from "react";

interface TextAreaProps {
  label: string;
  value: string;
  error?: string;
  onChange: (val: string) => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  error,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
        error ? "border-red-400" : "border-gray-200"
      }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default TextArea;
