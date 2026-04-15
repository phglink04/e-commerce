import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  addDeliveryPartner,
  deleteDeliveryPartner,
  getAdminUsers,
} from "@/lib/admin-api";
import { readServerSession } from "@/lib/server-session";

async function addDeliveryPartnerAction(formData: FormData) {
  "use server";

  const session = await readServerSession();
  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phoneNumber = String(formData.get("phoneNumber") || "").trim();
  const password = String(formData.get("password") || "12345678");
  const passwordConfirm = String(
    formData.get("passwordConfirm") || password || "12345678",
  );

  if (!name || !email || !phoneNumber) {
    return;
  }

  await addDeliveryPartner(session.token, {
    name,
    email,
    phoneNumber,
    password,
    passwordConfirm,
  });

  revalidatePath("/admin/deliveryPartner");
}

async function deleteDeliveryPartnerAction(formData: FormData) {
  "use server";

  const session = await readServerSession();
  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const userId = String(formData.get("userId") || "");
  if (!userId) {
    return;
  }

  await deleteDeliveryPartner(session.token, userId);
  revalidatePath("/admin/deliveryPartner");
}

export default async function ManageDeliveryPartnerPage() {
  const session = await readServerSession();
  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const users = await getAdminUsers(session.token);
  const partners = users
    .filter((user) => user.role === "deliverypartner")
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Delivery Partners
        </h1>
        <p className="mt-2 text-slate-600">
          Add new shipper accounts and remove inactive delivery partners.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Add Delivery Partner
          </h2>

          <form action={addDeliveryPartnerAction} className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                name="name"
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="10-digit phone"
                minLength={10}
                maxLength={10}
              />
            </div>

            <input type="hidden" name="password" value="12345678" />
            <input type="hidden" name="passwordConfirm" value="12345678" />

            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Add Delivery Partner
            </button>
          </form>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Current Delivery Partners
            </h2>
            <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
              {partners.length} accounts
            </span>
          </div>

          {partners.length === 0 ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              No delivery partner accounts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-600">
                    <th className="px-2 py-2">Name</th>
                    <th className="px-2 py-2">Email</th>
                    <th className="px-2 py-2">Phone</th>
                    <th className="px-2 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner._id} className="border-b border-slate-100">
                      <td className="px-2 py-2 font-semibold text-slate-900">
                        {partner.name}
                      </td>
                      <td className="px-2 py-2 text-slate-700">
                        {partner.email}
                      </td>
                      <td className="px-2 py-2 text-slate-700">
                        {partner.phoneNumber || "-"}
                      </td>
                      <td className="px-2 py-2 text-right">
                        <form action={deleteDeliveryPartnerAction}>
                          <input
                            type="hidden"
                            name="userId"
                            value={partner._id}
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                          >
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
