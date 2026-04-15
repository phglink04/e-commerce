import { formatDateWithDay } from "@/lib/date";

interface OrderHeaderProps {
  orderId: string;
  paymentId?: string;
  createdAt?: string;
  expectedDelivery?: string;
}

export default function OrderHeader({
  orderId,
  paymentId,
  createdAt,
  expectedDelivery,
}: OrderHeaderProps) {
  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-wide text-emerald-700 md:text-base lg:text-lg">
          Order ID: {orderId}
        </h3>
        {paymentId ? (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Payment confirmed
          </span>
        ) : null}
      </div>
      <div className="mt-3 space-y-1 text-xs text-slate-600 md:text-sm">
        {paymentId ? (
          <p>
            <span className="pr-2 font-semibold text-slate-700">
              Payment ID:
            </span>
            {paymentId}
          </p>
        ) : null}
        {createdAt ? (
          <p>
            <span className="pr-2 font-semibold text-slate-700">
              Order Placed On:
            </span>
            {formatDateWithDay(createdAt)}
          </p>
        ) : null}
        {expectedDelivery ? (
          <p>
            <span className="pr-2 font-semibold text-slate-700">
              Expected Delivery:
            </span>
            {formatDateWithDay(expectedDelivery)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
