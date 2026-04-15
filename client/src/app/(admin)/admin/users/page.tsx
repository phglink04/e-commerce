import { redirect } from "next/navigation";

import { getAdminUsers } from "@/lib/admin-api";
import { readServerSession } from "@/lib/server-session";

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-indigo-100 text-indigo-700",
  owner: "bg-violet-100 text-violet-700",
  deliverypartner: "bg-amber-100 text-amber-800",
  user: "bg-emerald-100 text-emerald-700",
};

export default async function ManageUsersPage() {
  const session = await readServerSession();
  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const users = await getAdminUsers(session.token);
  const sorted = [...users].sort((a, b) => a.role.localeCompare(b.role));

  const roleCounts = sorted.reduce<Record<string, number>>((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="bg-[#f9fff9] pb-5">
      <div className="mb-6">
        <h1 className="text-success mt-3 text-center font-serif text-xl font-bold md:text-3xl">
          Manage Users
        </h1>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(roleCounts).map(([role, count]) => (
          <div
            key={role}
            className="rounded-xl border border-slate-200 bg-white p-3"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {role}
            </p>
            <p className="text-2xl font-black text-slate-900">{count}</p>
          </div>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">Cart Items</th>
                <th className="px-3 py-3">Permission Logic</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((user) => {
                const role = user.role || "user";
                const isPrivileged = role === "admin" || role === "owner";

                return (
                  <tr key={user._id} className="border-t border-slate-100">
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_STYLES[role] || "bg-slate-100 text-slate-700"}`}
                      >
                        {role}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-900">
                      {user.name}
                    </td>
                    <td className="px-3 py-3 text-slate-700">{user.email}</td>
                    <td className="px-3 py-3 text-slate-700">
                      {user.phoneNumber || "-"}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {user.cart?.length || 0}
                    </td>
                    <td className="px-3 py-3">
                      {isPrivileged ? (
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          Locked: elevated role
                        </span>
                      ) : role === "deliverypartner" ? (
                        <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                          Logistics role
                        </span>
                      ) : (
                        <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                          Standard customer role
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
