"use client";

import { create } from "zustand";

import {
  clearAuthCookie,
  readAuthCookie,
  setAuthCookie,
} from "@/lib/auth-cookie";
import type { AuthUser } from "@/types/auth";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  role: string | null;
  hydrate: () => void;
  login: (token: string, user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  role: null,
  hydrate: () => {
    const session = readAuthCookie();
    if (!session) return;

    set({
      token: session.token,
      role: session.role,
      user: session.user || null,
    });
  },
  login: (token, user) => {
    setAuthCookie({ token, role: user.role, user });
    set({ token, user, role: user.role });
  },
  updateUser: (user) =>
    set((state) => {
      if (!state.token) {
        return { user };
      }

      const nextSession = { token: state.token, role: user.role, user };
      setAuthCookie(nextSession);
      return { user, role: user.role };
    }),
  logout: () => {
    clearAuthCookie();
    set({ token: null, user: null, role: null });
  },
}));
