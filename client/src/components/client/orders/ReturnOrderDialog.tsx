"use client";

interface ReturnOrderDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ReturnOrderDialog({
  open,
  onClose,
}: ReturnOrderDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4">
      <div className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-900">Return unavailable</h3>
        <p className="mt-3 text-sm text-slate-600">
          Return for this order is not available.
        </p>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
