"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateCurrentUser } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export default function ProfilePanel() {
  const router = useRouter();
  const { token, user, hydrate, updateUser } = useAuthStore();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    setName(user?.name ?? "");
    setPhoneNumber(user?.phoneNumber ?? "");
  }, [user]);

  const sessionToken = token ?? "";

  if (!sessionToken || !user) {
    return (
      <div className="mx-auto w-full max-w-lg rounded-lg border border-amber-300 bg-amber-50 p-4 text-center text-amber-900">
        <p className="text-base font-semibold">
          You need to sign in to view your profile.
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

  const currentUser = user;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const trimmedName = name.trim();
      const trimmedPhone = phoneNumber.trim();

      if (trimmedName.length < 3) {
        throw new Error("Name must be at least 3 characters long.");
      }

      if (trimmedPhone && !/^[0-9]{10}$/.test(trimmedPhone)) {
        throw new Error("Phone number must be exactly 10 digits.");
      }

      const result = await updateCurrentUser(sessionToken, {
        name: trimmedName,
        phoneNumber: trimmedPhone || undefined,
      });

      updateUser({
        id: result.data.user._id ?? result.data.user.id ?? currentUser.id,
        name: result.data.user.name,
        email: result.data.user.email,
        role: result.data.user.role,
        phoneNumber: result.data.user.phoneNumber,
      });

      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Failed to update profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex justify-center">
      <section className="mb-5 flex w-[85%] flex-col rounded-[10px] p-6 lg:max-w-[55%] lg:p-10 md:w-[80%]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="overflow-x-auto md:m-2">
            <table className="min-w-full overflow-hidden rounded border border-green-200 text-xs md:text-base">
              <thead className="font-semibold">
                <tr>
                  <th className="px-5 py-3 text-left">Field</th>
                  <th className="px-5 py-3 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-green-200">
                  <td className="px-5 py-3">Name</td>
                  <td className="px-5 py-3">
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none"
                      placeholder="Your full name"
                    />
                  </td>
                </tr>
                <tr className="border-t border-green-200">
                  <td className="px-5 py-3">Email</td>
                  <td className="px-5 py-3">
                    <input
                      value={user.email}
                      disabled
                      title="Email address"
                      placeholder="Email address"
                      className="w-full rounded border border-slate-300 bg-slate-100 px-3 py-2 text-slate-500 outline-none"
                    />
                  </td>
                </tr>
                <tr className="border-t border-green-200">
                  <td className="px-5 py-3">Mobile</td>
                  <td className="px-5 py-3">
                    <input
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none"
                      placeholder="10-digit mobile number"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {message ? (
            <p className="text-center text-sm font-medium text-slate-700">
              {message}
            </p>
          ) : null}

          <div className="flex justify-center">
            <input
              type="hidden"
              value={currentUser.role}
              readOnly
              aria-hidden
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
