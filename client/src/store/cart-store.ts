import { create } from "zustand";

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
  clearCart: () => set({ cart: [], totalAmount: 0 }),
  increase: (plantId, quantity) => {
    set((state) => {
      const cart = state.cart.map((item) =>
        item.plantId === plantId
          ? {
              ...item,
              quantity: item.quantity + 1,
              total: (item.quantity + 1) * item.price,
            }
          : item,
      );
      return { cart };
    });
  },
  decrease: (plantId, quantity) => {
    set((state) => {
      const cart = state.cart.map((item) =>
        item.plantId === plantId && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
              total: (item.quantity - 1) * item.price,
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
