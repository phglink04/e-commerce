import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getDeliveryOrders, updateAdminOrderStatus } from "@/lib/admin-api";
import { readServerSession } from "@/lib/server-session";

const ASSIGNED_STAGES = new Set([
  "Order Shipped",
  "Out for Delivery",
  "Order Delivered",
]);

function getCurrentStatus(stageHistory?: Array<{ stage: string }>) {
  return stageHistory?.[stageHistory.length - 1]?.stage || "Order Received";
}

function getNextDeliveryStatus(currentStatus: string) {
  if (currentStatus === "Order Shipped") {
    return "Out for Delivery";
  }

  if (currentStatus === "Out for Delivery") {
    return "Order Delivered";
  }

  return null;
}

function getStatusLabel(status: string) {
  if (status === "Out for Delivery") {
    return "Dang giao";
  }

  if (status === "Order Delivered") {
    return "Da giao";
  }

  return status;
}

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB").format(date);
}

async function updateStatusAction(formData: FormData) {
  "use server";

  const session = await readServerSession();
  if (!session?.token || session.role !== "deliverypartner") {
    redirect("/deliveryPartner/login");
  }

  const orderId = String(formData.get("orderId") || "");
  const newStatus = String(formData.get("newStatus") || "");
  if (!orderId || !newStatus) {
    return;
  }

  await updateAdminOrderStatus(session.token, orderId, newStatus);
  revalidatePath("/deliveryPartner/orders");
}

export default async function DeliveryOrdersPage() {
  const session = await readServerSession();
  if (!session?.token || session.role !== "deliverypartner") {
    redirect("/deliveryPartner/login");
  }

  const orders = await getDeliveryOrders(session.token);
  const assignedOrders = orders.filter((order) =>
    ASSIGNED_STAGES.has(getCurrentStatus(order.status)),
  );

  const sorted = [...assignedOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <section className="space-y-5 bg-[#f9fff9] pb-5">
      <div>
        <h1 className="text-success mt-3 text-center font-serif text-xl font-bold md:text-3xl">
          My Orders
        </h1>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          No orders data found.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((order, index) => {
            const currentStatus = getCurrentStatus(order.status);
            const nextStatus = getNextDeliveryStatus(currentStatus);

            return (
              <article
                key={order._id}
                className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
              >
                <div className="grid gap-3 md:grid-cols-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      No.
                    </p>
                    <p className="font-semibold text-slate-900">{index + 1}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Order ID
                    </p>
                    <p className="truncate font-semibold text-slate-900">
                      {order._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Customer
                    </p>
                    <p className="font-semibold text-slate-900">
                      {order.user?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Mobile
                    </p>
                    <p className="font-semibold text-slate-900">
                      {order.mobile || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Total
                    </p>
                    <p className="font-semibold text-emerald-700">
                      INR {order.orderTotal}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Created
                    </p>
                    <p className="font-medium text-slate-800">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Expected Delivery
                    </p>
                    <p className="font-medium text-slate-800">
                      {formatDate(order.expectedDelivery)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Current Status
                    </p>
                    <p className="font-medium text-slate-800">
                      {getStatusLabel(currentStatus)}
                    </p>
                  </div>
                  <div>
                    {nextStatus ? (
                      <form
                        action={updateStatusAction}
                        className="flex items-center gap-2"
                      >
                        <input type="hidden" name="orderId" value={order._id} />
                        <input
                          type="hidden"
                          name="newStatus"
                          value={nextStatus}
                        />
                        <button
                          type="submit"
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          {nextStatus === "Out for Delivery"
                            ? "Mark as Dang giao"
                            : "Mark as Da giao"}
                        </button>
                      </form>
                    ) : (
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                    View Order Details
                  </summary>
                  <div className="mt-3 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {order.addressLine1}, {order.addressLine2}, {order.area},{" "}
                      {order.city}, {order.state} - {order.pincode}
                    </p>
                    <div className="mt-3 overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-left text-slate-600">
                            <th className="px-2 py-2">#</th>
                            <th className="px-2 py-2">Name</th>
                            <th className="px-2 py-2">Qty</th>
                            <th className="px-2 py-2">Price</th>
                            <th className="px-2 py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items?.map((item, itemIndex) => (
                            <tr
                              key={`${order._id}-${itemIndex}`}
                              className="border-b border-slate-100"
                            >
                              <td className="px-2 py-2">{itemIndex + 1}</td>
                              <td className="px-2 py-2">
                                {item.plantId?.name || "Plant"}
                              </td>
                              <td className="px-2 py-2">{item.quantity}</td>
                              <td className="px-2 py-2">INR {item.price}</td>
                              <td className="px-2 py-2">INR {item.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </details>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
