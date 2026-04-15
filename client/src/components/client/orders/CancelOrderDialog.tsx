"use client";

import { useState } from "react";
import { cancelOrder } from "@/lib/orders";

interface CancelOrderDialogProps {
  orderId: string;
  open: boolean;
  token: string;
  onClose: () => void;
  onCancelled: () => void;
}

export default function CancelOrderDialog({
  orderId,
  open,
  token,
  onClose,
  onCancelled,
}: CancelOrderDialogProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = async () => {
    try {
      setIsCancelling(true);
      setError("");
      await cancelOrder(orderId, token);
      onCancelled();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4">
      <div className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-900">
          Confirm Cancellation
        </h3>
        <p className="mt-3 text-sm text-slate-600">
          Are you sure you want to cancel this order? This action cannot be
          undone.
        </p>
        {error ? (
          <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            No, Go Back
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
