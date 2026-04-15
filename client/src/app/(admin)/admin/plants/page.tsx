import { redirect } from "next/navigation";

import { getAdminPlants } from "@/lib/admin-api";
import { readServerSession } from "@/lib/server-session";
import AdminPlantsPage from "@/components/admin/plants/admin-plants-page";

export const dynamic = "force-dynamic";

export default async function ManagePlantsPage() {
  const session = await readServerSession();
  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const plants = await getAdminPlants();

  return (
    <AdminPlantsPage initialPlants={plants} initialToken={session.token} />
  );
}
