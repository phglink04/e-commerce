import { redirect } from "next/navigation";

import { API_BASE_URL } from "@/lib/config";
import { readServerSession } from "@/lib/server-session";

type SettingsPageProps = {
  searchParams?: Promise<{
    updated?: string;
    error?: string;
  }>;
};

async function updatePasswordAction(formData: FormData) {
  "use server";

  const session = await readServerSession();
  if (!session?.token || session.role !== "deliverypartner") {
    redirect("/deliveryPartner/login");
  }

  const currentPassword = String(formData.get("currentPassword") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const passwordConfirm = String(formData.get("passwordConfirm") || "").trim();

  if (!currentPassword || !password || !passwordConfirm) {
    redirect("/deliveryPartner/settings?error=All%20fields%20are%20required");
  }

  if (password.length < 8 || currentPassword.length < 8) {
    redirect(
      "/deliveryPartner/settings?error=Passwords%20must%20be%20at%20least%208%20characters",
    );
  }

  if (password !== passwordConfirm) {
    redirect(
      "/deliveryPartner/settings?error=Passwords%20are%20not%20the%20same",
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/updateMyPassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({
        currentPassword,
        password,
        passwordConfirm,
      }),
      cache: "no-store",
    });

    const json = (await response.json().catch(() => ({}))) as {
      message?: string;
    };

    if (!response.ok) {
      const message = json.message || "Failed to update password";
      redirect(
        `/deliveryPartner/settings?error=${encodeURIComponent(message)}`,
      );
    }

    redirect("/deliveryPartner/settings?updated=1");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update password";
    redirect(`/deliveryPartner/settings?error=${encodeURIComponent(message)}`);
  }
}

export default async function DeliverySettingsPage({
  searchParams,
}: SettingsPageProps) {
  const session = await readServerSession();
  if (!session?.token || session.role !== "deliverypartner") {
    redirect("/deliveryPartner/login");
  }

  const resolvedSearchParams = (await searchParams) || {};
  const updated = resolvedSearchParams.updated === "1";
  const error = resolvedSearchParams.error;

  return (
    <section className="space-y-5 bg-[#f9fff9] pb-5">
      <div>
        <h1 className="text-success mt-3 text-center font-serif text-xl font-bold md:text-3xl">
          Settings
        </h1>
      </div>

      {updated ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Password updated successfully.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <form
        action={updatePasswordAction}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 md:max-w-2xl">
          <label className="space-y-1 text-sm text-slate-700">
            <span>Current Password</span>
            <input
              type="password"
              name="currentPassword"
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-emerald-200 transition focus:ring"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span>New Password</span>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-emerald-200 transition focus:ring"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span>Confirm New Password</span>
            <input
              type="password"
              name="passwordConfirm"
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-emerald-200 transition focus:ring"
            />
          </label>

          <button
            type="submit"
            className="w-fit rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Update Password
          </button>
        </div>
      </form>
    </section>
  );
}
