"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCurrentUser, updateCurrentPassword } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export default function SettingsPanel() {
  const router = useRouter();
  const { token, hydrate, logout } = useAuthStore();
  const [selectedOption, setSelectedOption] = useState<
    "password" | "delete" | ""
  >("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const sessionToken = token ?? "";

  if (!sessionToken) {
    return (
      <div className="mx-auto w-full max-w-lg rounded-lg border border-amber-300 bg-amber-50 p-4 text-center text-amber-900">
        <p className="text-base font-semibold">
          You need to sign in to manage account settings.
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

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);

    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("Please complete all password fields.");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("New password and confirmation must match.");
      }

      await updateCurrentPassword(sessionToken, {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setPasswordMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMessage(
        err instanceof Error ? err.message : "Failed to update password.",
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    setDeleteMessage(null);

    try {
      if (!confirmDelete) {
        throw new Error("Please confirm account deletion first.");
      }

      await deleteCurrentUser(sessionToken);
      logout();
      router.push("/");
    } catch (err) {
      setDeleteMessage(
        err instanceof Error ? err.message : "Failed to delete account.",
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="relative flex justify-center">
      <section className="mb-[2rem] flex w-[85%] flex-col rounded-[10px] p-6 lg:max-w-[55%] lg:p-10 md:w-[80%]">
        <div className="mt-2 mb-10 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() =>
              setSelectedOption((value) =>
                value === "password" ? "" : "password",
              )
            }
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-all md:text-base ${
              selectedOption === "password"
                ? "bg-success text-white"
                : "bg-green-200 text-green-800 hover:bg-green-300"
            }`}
          >
            Update Password
          </button>
          <button
            type="button"
            onClick={() =>
              setSelectedOption((value) => (value === "delete" ? "" : "delete"))
            }
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-all md:text-base ${
              selectedOption === "delete"
                ? "bg-danger text-white"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            Delete Account
          </button>
        </div>
      </section>

      {selectedOption === "password" ? (
        <section className="mx-auto w-[85%] rounded-[10px] border border-slate-200 bg-white p-6 lg:max-w-[55%]">
          <h3 className="text-lg font-bold text-slate-900">Update Password</h3>
          <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Current password"
              className="w-full rounded border border-slate-300 px-3 py-2 outline-none"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="New password"
              className="w-full rounded border border-slate-300 px-3 py-2 outline-none"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded border border-slate-300 px-3 py-2 outline-none"
            />
            {passwordMessage ? (
              <p className="text-sm font-medium text-slate-700">
                {passwordMessage}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={passwordLoading}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>
      ) : null}

      {selectedOption === "delete" ? (
        <section className="mx-auto w-[85%] rounded-[10px] border border-rose-200 bg-rose-50 p-6 lg:max-w-[55%]">
          <h3 className="text-lg font-bold text-rose-900">Delete Account</h3>
          <p className="mt-2 text-sm text-rose-800">
            This action is permanent. All your account data will be removed.
          </p>
          <label className="mt-5 flex items-center gap-3 text-sm font-medium text-rose-900">
            <input
              type="checkbox"
              checked={confirmDelete}
              onChange={(event) => setConfirmDelete(event.target.checked)}
              className="h-4 w-4 rounded border-rose-300 text-rose-600"
            />
            I understand this cannot be undone.
          </label>
          {deleteMessage ? (
            <p className="mt-3 text-sm font-medium text-rose-700">
              {deleteMessage}
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            className="mt-5 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteLoading ? "Deleting..." : "Delete My Account"}
          </button>
        </section>
      ) : null}

      {!selectedOption ? (
        <p className="text-center text-xs text-gray-500 md:text-sm lg:text-base">
          Please select an option above to manage your account.
        </p>
      ) : null}
    </div>
  );
}
