import { redirect } from "next/navigation";

import { readServerSession } from "@/lib/server-session";

export default async function AdminProfilePage() {
  const session = await readServerSession();

  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const admin = session.user;

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Admin Profile</h1>
        <p className="mt-2 text-slate-600">
          View account details of the currently authenticated admin.
        </p>
      </div>

      <div className="max-w-3xl overflow-x-auto rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-600">
              <th className="px-3 py-3">Field</th>
              <th className="px-3 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-3 font-medium text-slate-700">Name</td>
              <td className="px-3 py-3 text-slate-900">
                {admin?.name || "Admin"}
              </td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-3 font-medium text-slate-700">Email</td>
              <td className="px-3 py-3 text-slate-900">
                {admin?.email || "Not provided"}
              </td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-3 font-medium text-slate-700">Mobile</td>
              <td className="px-3 py-3 text-slate-900">
                {admin?.phoneNumber || "Not provided"}
              </td>
            </tr>
            <tr>
              <td className="px-3 py-3 font-medium text-slate-700">Role</td>
              <td className="px-3 py-3 text-slate-900">
                {admin?.role || session.role}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
