import { create } from "zustand";

import { mergeUserCart } from "@/lib/cart-api";

export interface CartItem {
  id: string;
  plantId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

interface CartState {
  cart: CartItem[];
  totalAmount: number;
  setCart: (cart: CartItem[]) => void;
  setTotalAmount: (amount: number) => void;
  mergeCart: (token: string, cartItems?: CartItem[]) => Promise<CartItem[]>;
  clearCart: () => void;
  increase: (plantId: string, quantity: number) => void;
  decrease: (plantId: string, quantity: number) => void;
  remove: (plantId: string) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  totalAmount: 0,
  setCart: (cart) => set({ cart }),
  setTotalAmount: (amount) => set({ totalAmount: amount }),
  mergeCart: async (token, cartItems) => {
    if (!token) {
      return get().cart;
    }

    const itemsToMerge = (cartItems ?? get().cart).map((item) => ({
      plantId: item.plantId,
      quantity: item.quantity,
      price: item.price,
    }));

    const mergedCart = await mergeUserCart(token, itemsToMerge);
    const mergedTotal = mergedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    set({ cart: mergedCart, totalAmount: mergedTotal });

    return mergedCart;
  },
  clearCart: () => set({ cart: [], totalAmount: 0 }),
  increase: (plantId, quantity) => {
    set((state) => {
      const step = quantity > 0 ? quantity : 1;
      const cart = state.cart.map((item) =>
        item.plantId === plantId
          ? {
              ...item,
              quantity: item.quantity + step,
              total: (item.quantity + step) * item.price,
            }
          : item,
      );
      return { cart };
    });
  },
  decrease: (plantId, quantity) => {
    set((state) => {
      const step = quantity > 0 ? quantity : 1;
      const cart = state.cart.map((item) =>
        item.plantId === plantId && item.quantity - step >= 1
          ? {
              ...item,
              quantity: item.quantity - step,
              total: (item.quantity - step) * item.price,
            }
          : item,
      );
      return { cart };
    });
  },
  remove: (plantId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.plantId !== plantId),
    }));
  },
}));
