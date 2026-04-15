"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchPaymentQr,
  verifyPaymentStatus,
  type PaymentMethod,
  type PaymentQrData,
} from "@/lib/checkout";

export function formatVND(amount: number) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

type CheckoutInvoiceDialogProps = {
  open: boolean;
  orderId: string;
  amount: number;
  token: string;
  onClose: () => void;
  onPaidSuccess: () => Promise<void> | void;
};

export default function CheckoutInvoiceDialog({
  open,
  orderId,
  amount,
  token,
  onClose,
  onPaidSuccess,
}: CheckoutInvoiceDialogProps) {
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState<PaymentQrData | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const bankName = useMemo(
    () => process.env.NEXT_PUBLIC_MB_BANK_NAME || "MB Bank",
    [],
  );

  const accountNo = useMemo(
    () => process.env.NEXT_PUBLIC_MB_BANK_ACCOUNT_NO || "",
    [],
  );

  useEffect(() => {
    if (!open) {
      setMethod("CASH");
      setIsSubmitting(false);
      setIsLoadingQr(false);
      setIsVerifying(false);
      setError("");
      setQrData(null);
      setIsPaid(false);
    }
  }, [open]);

  const loadQr = useCallback(async () => {
    if (!token || !orderId) return;
    setIsLoadingQr(true);
    setError("");

    try {
      const data = await fetchPaymentQr(token, orderId);
      setQrData(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Khong the tao ma QR. Vui long thu lai.",
      );
    } finally {
      setIsLoadingQr(false);
    }
  }, [orderId, token]);

  const verifyPayment = useCallback(async () => {
    if (!token || !orderId) return false;
    setIsVerifying(true);

    try {
      const result = await verifyPaymentStatus(token, orderId);
      const paid = result.paid;
      setIsPaid(paid);
      if (paid) {
        await onPaidSuccess();
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [onPaidSuccess, orderId, token]);

  useEffect(() => {
    if (!open || method !== "TRANSFER") {
      return;
    }

    if (!qrData) {
      void loadQr();
    }
  }, [loadQr, method, open, qrData]);

  useEffect(() => {
    if (!open || method !== "TRANSFER" || !qrData || isPaid) {
      return;
    }

    const timer = setInterval(() => {
      void verifyPayment();
    }, 10000);

    return () => clearInterval(timer);
  }, [isPaid, method, open, qrData, verifyPayment]);

  const handleConfirm = async () => {
    setError("");

    if (method === "TRANSFER" && !isPaid) {
      setError("Vui long hoan tat chuyen khoan truoc khi xac nhan dat hang.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onPaidSuccess();
    } catch (confirmError) {
      setError(
        confirmError instanceof Error
          ? confirmError.message
          : "Co loi khi xac nhan dat hang.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-slate-900">
          Thanh toan don hang
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Tong thanh toan: <strong>{formatVND(amount)}</strong>
        </p>

        <div className="mt-5 space-y-3">
          <p className="text-sm font-medium text-slate-900">
            Phuong thuc thanh toan
          </p>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="paymentMethod"
              value="CASH"
              checked={method === "CASH"}
              onChange={() => setMethod("CASH")}
            />
            CASH (Tien mat)
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="paymentMethod"
              value="TRANSFER"
              checked={method === "TRANSFER"}
              onChange={() => setMethod("TRANSFER")}
            />
            TRANSFER (Chuyen khoan)
          </label>
        </div>

        {method === "TRANSFER" && (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="text-sm font-semibold text-emerald-800">
              Quet ma VietQR de thanh toan
            </p>

            {isLoadingQr && (
              <p className="mt-2 text-sm text-slate-600">Dang tao ma QR...</p>
            )}

            {qrData && (
              <div className="mt-3 space-y-3">
                <img
                  src={qrData.qrImageUrl}
                  alt="VietQR"
                  className="mx-auto h-56 w-56 rounded-md border bg-white object-contain"
                />

                <div className="grid grid-cols-1 gap-2 text-sm text-slate-700">
                  <p>
                    <strong>Ngan hang:</strong> {qrData.bankName || bankName}
                  </p>
                  <p>
                    <strong>STK:</strong>{" "}
                    {qrData.accountNo || accountNo || "Dang cap nhat"}
                  </p>
                  <p>
                    <strong>Noi dung CK:</strong> {qrData.referenceCode}
                  </p>
                  <p>
                    <strong>So tien:</strong> {formatVND(qrData.amount)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void verifyPayment()}
                  className="rounded-md border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                  disabled={isVerifying}
                >
                  {isVerifying
                    ? "Dang kiem tra..."
                    : "Kiem tra thanh toan ngay"}
                </button>

                {isPaid ? (
                  <p className="text-sm font-medium text-emerald-700">
                    Thanh toan thanh cong. Dang chuyen den trang ket qua...
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    He thong tu dong kiem tra giao dich moi 10 giay.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Dong
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            disabled={isSubmitting || (method === "TRANSFER" && !isPaid)}
          >
            {isSubmitting ? "Dang xu ly..." : "Xac nhan dat hang"}
          </button>
        </div>
      </div>
    </div>
  );
}
