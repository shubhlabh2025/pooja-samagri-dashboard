import React from "react";

interface DismissDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DismissDialog: React.FC<DismissDialogProps> = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Yes",
  cancelLabel = "No",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
      <div
        className="bg-white rounded-xl p-6 shadow-lg min-w-[320px] max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-2 text-lg font-semibold text-gray-800">
            {title}
          </div>
        )}
        <div className="mb-6 text-gray-700">{message}</div>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DismissDialog;
