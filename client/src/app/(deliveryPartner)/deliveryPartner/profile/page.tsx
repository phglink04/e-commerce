import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { updateCurrentUser } from "@/lib/api";
import { readServerSession } from "@/lib/server-session";
import type { Session } from "@/types/auth";

type ProfilePageProps = {
  searchParams?: Promise<{
    updated?: string;
    error?: string;
  }>;
};

const AUTH_COOKIE_NAME = "plantworld_auth";

async function updateProfileAction(formData: FormData) {
  "use server";

  const session = await readServerSession();
  if (!session?.token || session.role !== "deliverypartner") {
    redirect("/deliveryPartner/login");
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phoneNumber = String(formData.get("phoneNumber") || "").trim();

  if (!name || !email) {
    redirect(
      "/deliveryPartner/profile?error=Name%20and%20email%20are%20required",
    );
  }

  try {
    const response = await updateCurrentUser(session.token, {
      name,
      email,
      phoneNumber,
    });

    const updatedUser = response.data.user;
    const mergedSession: Session = {
      ...session,
      user: {
        id: updatedUser.id || updatedUser._id || session.user?.id || "",
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
      },
    };

    const cookieStore = await cookies();
    cookieStore.set(
      AUTH_COOKIE_NAME,
      encodeURIComponent(JSON.stringify(mergedSession)),
      {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      },
    );

    revalidatePath("/deliveryPartner/profile");
    redirect("/deliveryPartner/profile?updated=1");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile";
    redirect(`/deliveryPartner/profile?error=${encodeURIComponent(message)}`);
  }
}

export default async function DeliveryProfilePage({
  searchParams,
}: ProfilePageProps) {
  const session = await readServerSession();
  if (!session?.token || session.role !== "deliverypartner") {
    redirect("/deliveryPartner/login");
  }

  const resolvedSearchParams = (await searchParams) || {};
  const user = session.user;
  const hasUpdated = resolvedSearchParams.updated === "1";
  const error = resolvedSearchParams.error;

  return (
    <section className="space-y-5 bg-[#f9fff9] pb-5">
      <div>
        <h1 className="text-success mt-3 text-center font-serif text-xl font-bold md:text-3xl">
          My Profile
        </h1>
      </div>

      {hasUpdated ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Profile updated successfully.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-600">
              <th className="px-3 py-3">Field</th>
              <th className="px-3 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-3 font-semibold text-slate-700">Name</td>
              <td className="px-3 py-3 text-slate-900">
                {user?.name || "Delivery Partner"}
              </td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-3 font-semibold text-slate-700">Email</td>
              <td className="px-3 py-3 text-slate-900">
                {user?.email || "Not provided"}
              </td>
            </tr>
            <tr>
              <td className="px-3 py-3 font-semibold text-slate-700">Mobile</td>
              <td className="px-3 py-3 text-slate-900">
                {user?.phoneNumber || "Not provided"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <form
        action={updateProfileAction}
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm text-slate-700">
            <span>Name</span>
            <input
              name="name"
              defaultValue={user?.name || ""}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-emerald-200 transition focus:ring"
            />
          </label>
          <label className="space-y-1 text-sm text-slate-700">
            <span>Email</span>
            <input
              name="email"
              type="email"
              defaultValue={user?.email || ""}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-emerald-200 transition focus:ring"
            />
          </label>
          <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
            <span>Phone Number</span>
            <input
              name="phoneNumber"
              defaultValue={user?.phoneNumber || ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-emerald-200 transition focus:ring"
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Update Profile
        </button>
      </form>

      <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
        <span className="font-semibold">Important:</span> If you are using the
        default password, please change it immediately in Settings.
      </div>
    </section>
  );
}
