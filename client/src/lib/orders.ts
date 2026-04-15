import { API_BASE_URL } from "@/lib/config";
import type { OrderSummary } from "@/types/order";

type OrdersResponse = {
  status: string;
  orders?: OrderSummary[];
  message?: string;
};

export async function fetchMyOrders(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = (await response.json()) as OrdersResponse;

  if (!response.ok) {
    throw new Error(json.message || "Failed to fetch orders");
  }

  return json.orders ?? [];
}

export async function cancelOrder(orderId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = (await response.json()) as OrdersResponse;

  if (!response.ok) {
    throw new Error(json.message || "Failed to cancel order");
  }

  return json;
}
