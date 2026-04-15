"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmptyOrdersMessage from "./EmptyOrdersMessage";
import LoadingState from "./LoadingState";
import OrderCard from "./OrderCard";
import { useAuthStore } from "@/store/auth-store";
import { fetchMyOrders } from "@/lib/orders";
import type { OrderSummary } from "@/types/order";

export default function OrdersSection() {
  const router = useRouter();
  const { token, hydrate } = useAuthStore();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetchMyOrders(token);
        if (isMounted) {
          setOrders([...response].reverse());
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch orders",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (loading) {
    return <LoadingState />;
  }

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-lg rounded-lg border border-amber-300 bg-amber-50 p-4 text-center text-amber-900">
        <p className="text-base font-semibold">
          You need to sign in to view orders.
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-4 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-lg rounded-lg border border-rose-200 bg-rose-50 p-4 text-center text-rose-700">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  if (!orders.length) {
    return <EmptyOrdersMessage />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          token={token}
          onCancelSuccess={async () => {
            const refreshed = await fetchMyOrders(token);
            setOrders([...refreshed].reverse());
          }}
        />
      ))}
    </div>
  );
}
