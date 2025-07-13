import React, { useState } from "react";

interface CommentDialogProps {
  open: boolean;
  heading?: string;
  title?: string;
  message?: string;
  loading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (comment: string) => void;
  onCancel: () => void;
}

const CommentDialog: React.FC<CommentDialogProps> = ({
  open,
  heading = "Add Comment",
  title = "Are you sure?",
  message,
  loading = false,
  confirmLabel = "Save",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSave = () => {
    if (comment.trim().length < 10) {
      setError("Comment must be at least 10 characters long.");
      return;
    }
    onConfirm(comment.trim());
    setComment("");
    setError("");
  };

  const handleCancel = () => {
    setComment("");
    setError("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
      <div
        className="bg-white rounded-xl p-6 shadow-lg min-w-[320px] max-w-full w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 text-xl font-semibold text-gray-900">
          {heading}
        </div>
        {title && <div className="mb-2 text-sm text-gray-700">{title}</div>}
        {message && <div className="mb-4 text-sm text-gray-600">{message}</div>}

        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your comment..."
        />
        {error && <div className="text-xs text-red-500 mt-1">{error}</div>}

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
            onClick={handleCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            onClick={handleSave}
            disabled={loading}
          >
            {loading && (
              <svg
                className="w-4 h-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {loading ? "Saving..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
