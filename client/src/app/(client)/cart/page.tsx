"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CartList from "@/components/client/cart/CartList";
import CartSummary from "@/components/client/cart/CartSummary";
import EmptyCart from "@/components/client/cart/EmptyCart";
import {
  clearUserCart,
  fetchCart,
  fetchCartTotal,
  removeCartItem,
  updateCartQuantity,
} from "@/lib/cart-api";
import { readAuthCookie } from "@/lib/auth-cookie";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cart, totalAmount, setCart, setTotalAmount, clearCart } =
    useCartStore();

  const session = useMemo(() => readAuthCookie(), []);
  const token = session?.token || "";

  const syncCart = useCallback(async () => {
    if (!token) {
      setCart([]);
      setTotalAmount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [items, total] = await Promise.all([
        fetchCart(token),
        fetchCartTotal(token),
      ]);
      setCart(items);
      setTotalAmount(total);
    } catch (syncError) {
      setError(
        syncError instanceof Error ? syncError.message : "Failed to load cart",
      );
    } finally {
      setIsLoading(false);
    }
  }, [setCart, setTotalAmount, token]);

  useEffect(() => {
    void syncCart();
  }, [syncCart]);

  const handleIncrease = async (plantId: string, quantity: number) => {
    if (!token) {
      return;
    }

    try {
      const updated = await updateCartQuantity(token, plantId, quantity + 1);
      setCart(updated);
      setTotalAmount(
        updated.reduce((sum, item) => sum + item.price * item.quantity, 0),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update quantity",
      );
    }
  };

  const handleDecrease = async (plantId: string, quantity: number) => {
    if (!token) {
      return;
    }

    try {
      if (quantity <= 1) {
        const updated = await removeCartItem(token, plantId);
        setCart(updated);
        setTotalAmount(
          updated.reduce((sum, item) => sum + item.price * item.quantity, 0),
        );
        return;
      }

      const updated = await updateCartQuantity(token, plantId, quantity - 1);
      setCart(updated);
      setTotalAmount(
        updated.reduce((sum, item) => sum + item.price * item.quantity, 0),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update quantity",
      );
    }
  };

  const handleRemove = async (plantId: string) => {
    if (!token) {
      return;
    }

    try {
      const updated = await removeCartItem(token, plantId);
      setCart(updated);
      setTotalAmount(
        updated.reduce((sum, item) => sum + item.price * item.quantity, 0),
      );
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Failed to remove cart item",
      );
    }
  };

  const handleClear = async () => {
    if (!token) {
      return;
    }

    try {
      await clearUserCart(token);
      clearCart();
    } catch (clearError) {
      setError(
        clearError instanceof Error
          ? clearError.message
          : "Failed to clear cart",
      );
    }
  };

  const handleProceedToAddress = () => {
    router.push("/cart/address");
  };

  if (isLoading) {
    return (
      <div className="relative flex min-h-[60vh] items-center justify-center bg-[#ecffed]">
        <p className="text-sm font-semibold text-slate-700">Loading cart...</p>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="relative flex justify-center items-center bg-[#ecffed] min-h-[60vh]">
        <div className="flex flex-col w-[90%] md:w-[80%] max-w-[1200px] bg-white/80 rounded-[10px] shadow-lg mt-10 md:mt-12 mb-5 p-6 lg:p-10">
          <EmptyCart />
          {error ? (
            <p className="mt-4 text-center text-sm text-rose-600">{error}</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center bg-[#ecffed] min-h-[60vh]">
      <div className="flex flex-col w-[90%] md:w-[80%] max-w-[1200px] bg-white/80 rounded-[10px] shadow-lg mt-10 md:mt-12 mb-5 p-6 lg:p-10">
        <h2 className="text-success font-bold text-2xl md:text-3xl text-center mb-8 font-serif">
          Your Cart
        </h2>
        <CartList
          items={cart}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        <CartSummary
          totalAmount={totalAmount}
          onProceed={handleProceedToAddress}
          onClear={handleClear}
        />
      </div>
    </div>
  );
}
