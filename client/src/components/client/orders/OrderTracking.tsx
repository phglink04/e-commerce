import type { OrderStatusEntry, OrderStatusStage } from "@/types/order";

interface OrderTrackingProps {
  status: OrderStatusEntry[];
}

const statusStages: OrderStatusStage[] = [
  "Order Received",
  "Order Shipped",
  "Out for Delivery",
  "Order Delivered",
];

export default function OrderTracking({ status }: OrderTrackingProps) {
  const latestStage = status.length ? status[status.length - 1].stage : "";
  const isCancelled = latestStage === "Order Cancelled";
  const activeIndex = statusStages.indexOf(latestStage as OrderStatusStage);

  return (
    <div className="mb-6">
      <h4 className="mb-3 text-sm font-semibold text-slate-800 md:text-base">
        Tracking Status
      </h4>
      {isCancelled ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          This order has been cancelled.
        </div>
      ) : (
        <ol className="grid gap-3 md:grid-cols-4">
          {statusStages.map((label, index) => {
            const completed = index <= activeIndex;
            return (
              <li
                key={label}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  completed
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      completed
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span>{label}</span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
