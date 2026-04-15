"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";

const navItems = [
  { href: "/admin/plants", label: "Plants" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/deliveryPartner", label: "Delivery Partner" },
  { href: "/admin/profile", label: "Profile" },
];

const pageTitleMap: Record<string, string> = {
  plants: "Manage Plants",
  orders: "Manage Orders",
  users: "Manage Users",
  faqs: "Manage FAQs",
  deliveryPartner: "Add Delivery Partner",
  profile: "Manage Profile",
  login: "Login",
};

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const currentPath = pathname.split("/").pop() || "";
  const pageTitle = pageTitleMap[currentPath] || "Admin Panel";

  return (
    <div className="min-h-screen bg-[#f9fff9]">
      <header className="fixed top-0 right-0 left-0 z-20 bg-[#4ead54] px-4 py-3 text-white shadow-md lg:left-64">
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
      </header>

      <div className="flex min-h-screen pt-14">
        <aside className="hidden w-64 border-r border-emerald-100 bg-[#ecffed] p-4 lg:block">
          <h2 className="mb-6 text-xl font-bold text-green-700">Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm ${pathname === item.href ? "bg-emerald-700 text-white" : "text-slate-700 hover:bg-emerald-50"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={logout}
            className="mt-8 w-full rounded-md border border-rose-200 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
          >
            Logout
          </button>
        </aside>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
