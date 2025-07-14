import React from "react";
import { createPortal } from "react-dom";

type ConfirmationModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal({
  isOpen,
  title = "Confirmation",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      style={{ backdropFilter: "blur(1px)" }}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="modal-title"
          className="text-2xl font-semibold text-blue-700 mb-4 text-center"
        >
          {title}
        </h2>
        <p
          id="modal-description"
          className="text-gray-800 mb-6 text-center whitespace-pre-wrap"
        >
          {message}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50 transition font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
