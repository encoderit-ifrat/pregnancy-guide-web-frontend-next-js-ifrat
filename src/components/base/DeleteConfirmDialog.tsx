// components/DeleteConfirmDialog.tsx
import { ReactNode } from "react";

interface DeleteConfirmDialogProps {
  itemName: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const DeleteConfirmDialog = ({
  itemName,
  onConfirm,
  onCancel,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}: DeleteConfirmDialogProps) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        {description || (
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{itemName}</span>? This action
            cannot be undone.
          </>
        )}
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          type="button"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          type="button"
        >
          {isLoading ? "Deleting..." : confirmText}
        </button>
      </div>
    </div>
  );
};
