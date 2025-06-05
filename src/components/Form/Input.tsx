import React from "react";

interface InputProps {
  label: string;
  value: string;
  type?: string;
  error?: string;
  placeholder?: string; // <-- add this line
  onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  type = "text",
  error,
  placeholder, // <-- add this line
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} // <-- add this line
        className={`w-full px-3 py-2 border rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
