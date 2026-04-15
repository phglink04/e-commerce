"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { loginWithEmailPassword } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export default function LoginForm({
  role,
}: {
  role?: "admin" | "deliverypartner" | "user";
}) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const mergeCart = useCartStore((state) => state.mergeCart);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await loginWithEmailPassword(email, password);
      if (role && result.data.user.role !== role) {
        throw new Error("Account role is not allowed for this login page");
      }

      login(result.token, result.data.user);

      const localCart = useCartStore.getState().cart;
      await mergeCart(result.token, localCart);

      if (result.data.user.role === "admin") {
        router.push("/admin/plants");
      } else if (result.data.user.role === "deliverypartner") {
        router.push("/deliveryPartner/orders");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md rounded-[10px] bg-[#f4f7f4] p-4 md:p-6"
    >
      <h2 className="mb-2 text-center text-base font-semibold md:text-xl">
        Login to your PlantWorld Account
      </h2>
      <p className="mb-4 text-center text-xs text-slate-600 md:text-sm">
        Enter your credentials to continue
      </p>

      <label
        htmlFor="login-email"
        className="mt-2 block text-sm font-medium text-slate-700"
      >
        Email
      </label>
      <input
        id="login-email"
        className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label
        htmlFor="login-password"
        className="mt-4 block text-sm font-medium text-slate-700"
      >
        Password
      </label>
      <input
        id="login-password"
        className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-md bg-[#72a876] px-4 py-2 font-semibold text-white hover:bg-[#5c9460] disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
