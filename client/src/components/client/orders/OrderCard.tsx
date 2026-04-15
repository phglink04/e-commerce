"use client";

import { useState } from "react";
import { formatVND } from "@/lib/currency";
import type { OrderSummary } from "@/types/order";
import OrderHeader from "./OrderHeader";
import OrderTracking from "./OrderTracking";
import OrderItems from "./OrderItems";
import CancelOrderDialog from "./CancelOrderDialog";
import ReturnOrderDialog from "./ReturnOrderDialog";

interface OrderCardProps {
  order: OrderSummary;
  token: string;
  onCancelSuccess: () => void;
}

export default function OrderCard({
  order,
  token,
  onCancelSuccess,
}: OrderCardProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState<"cancel" | "return" | null>(
    null,
  );

  const latestStage = order.status.length
    ? order.status[order.status.length - 1].stage
    : "";
  const isDelivered = latestStage === "Order Delivered";
  const isCancellable = !isDelivered && latestStage !== "Order Cancelled";

  return (
    <article className="rounded-[1.5rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_50px_rgba(16,185,129,0.10)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(16,185,129,0.14)]">
      <OrderHeader
        orderId={order._id}
        paymentId={order.paymentId}
        createdAt={order.createdAt}
        expectedDelivery={order.expectedDelivery}
      />
      <OrderTracking status={order.status} />
      <OrderItems items={order.items} />
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-emerald-700 md:text-lg">
          Total: {formatVND(order.orderTotal)}
        </div>
        <div className="flex items-center gap-3">
          {isCancellable ? (
            <button
              type="button"
              onClick={() => {
                setActionType("cancel");
                setOpenDialog(true);
              }}
              className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 md:text-sm"
            >
              Cancel Order
            </button>
          ) : null}
          {isDelivered ? (
            <button
              type="button"
              onClick={() => {
                setActionType("return");
                setOpenDialog(true);
              }}
              className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-700 md:text-sm"
            >
              Return Order
            </button>
          ) : null}
        </div>
      </div>
      <CancelOrderDialog
        orderId={order._id}
        open={openDialog && actionType === "cancel"}
        token={token}
        onClose={() => setOpenDialog(false)}
        onCancelled={onCancelSuccess}
      />
      <ReturnOrderDialog
        open={openDialog && actionType === "return"}
        onClose={() => setOpenDialog(false)}
      />
    </article>
  );
}
