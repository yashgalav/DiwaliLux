import { useEffect } from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void | Promise<void>;
  onConfirm?: () => void | Promise<void>;
  title?: string;
  children?: React.ReactNode;
}

export default function Popup({ isOpen, onClose, onConfirm, title, children }: PopupProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
        >
          ✕
        </button>

        {/* Title */}
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        {/* Content */}
        <div>{children}</div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          {onConfirm && (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

