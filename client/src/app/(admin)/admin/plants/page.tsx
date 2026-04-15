import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Image from "next/image";

import {
  createAdminPlant,
  deleteAdminPlant,
  getAdminPlants,
  updateAdminPlant,
} from "@/lib/admin-api";
import { readServerSession } from "@/lib/server-session";

export const dynamic = "force-dynamic";

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function createPlantAction(formData: FormData) {
  "use server";

  const session = await readServerSession();
  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const payload = {
    name: String(formData.get("name") || "").trim(),
    price: Number(formData.get("price") || 0),
    quantity: Number(formData.get("quantity") || 0),
    shortDescription: String(formData.get("shortDescription") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    tag: String(formData.get("tag") || "").trim(),
    availability: String(formData.get("availability") || "In Stock").trim(),
    imageCover: String(formData.get("imageCover") || "").trim(),
    color: parseList(String(formData.get("color") || "Green")),
    plantCareTips: parseList(String(formData.get("plantCareTips") || "")),
  };

  if (
    !payload.name ||
    !payload.shortDescription ||
    !payload.description ||
    !payload.category ||
    !payload.tag ||
    !payload.imageCover
  ) {
    return;
  }

  await createAdminPlant(session.token, payload);
  revalidatePath("/admin/plants");
}

async function updatePlantAction(formData: FormData) {
  "use server";

  const session = await readServerSession();
  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") || "");
  if (!id) {
    return;
  }

  const payload = {
    name: String(formData.get("name") || "").trim(),
    price: Number(formData.get("price") || 0),
    quantity: Number(formData.get("quantity") || 0),
    shortDescription: String(formData.get("shortDescription") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    tag: String(formData.get("tag") || "").trim(),
    availability: String(formData.get("availability") || "In Stock").trim(),
    imageCover: String(formData.get("imageCover") || "").trim(),
    color: parseList(String(formData.get("color") || "Green")),
    plantCareTips: parseList(String(formData.get("plantCareTips") || "")),
  };

  await updateAdminPlant(session.token, id, payload);
  revalidatePath("/admin/plants");
}

async function deletePlantAction(formData: FormData) {
  "use server";

  const session = await readServerSession();
  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") || "");
  if (!id) {
    return;
  }

  await deleteAdminPlant(session.token, id);
  revalidatePath("/admin/plants");
}

export default async function ManagePlantsPage() {
  const session = await readServerSession();
  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const plants = await getAdminPlants();

  return (
    <section className="space-y-6 bg-[#f9fff9] pb-5">
      <div>
        <h1 className="text-success mt-3 text-center font-serif text-xl font-bold md:text-3xl">
          Manage Plants
        </h1>
      </div>

      <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Add New Plant</h2>
        <form
          action={createPlantAction}
          className="mt-4 grid gap-3 md:grid-cols-2"
        >
          <input
            name="name"
            required
            placeholder="Name"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            name="imageCover"
            required
            placeholder="Image URL"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            name="price"
            type="number"
            required
            placeholder="Price"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            name="quantity"
            type="number"
            required
            placeholder="Quantity"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            name="category"
            required
            placeholder="Category"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            name="tag"
            required
            placeholder="Tag (Indoor/Outdoor)"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            name="availability"
            defaultValue="In Stock"
            placeholder="Availability"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            name="color"
            defaultValue="Green"
            placeholder="Color list (comma separated)"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <div className="md:col-span-2">
            <input
              name="shortDescription"
              required
              placeholder="Short description"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Description"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <textarea
              name="plantCareTips"
              rows={2}
              placeholder="Plant care tips (comma separated)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Add Plant
            </button>
          </div>
        </form>
      </article>

      {plants.length === 0 ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          No plants data found.
        </div>
      ) : (
        <div className="space-y-3">
          {plants.map((plant) => (
            <details
              key={plant._id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <summary className="cursor-pointer font-semibold text-slate-900">
                {plant.name} - INR {plant.price}
              </summary>

              <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_auto]">
                <form
                  action={updatePlantAction}
                  className="grid gap-2 md:grid-cols-2"
                >
                  <input type="hidden" name="id" value={plant._id} />
                  <input
                    name="name"
                    defaultValue={plant.name}
                    required
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    name="imageCover"
                    defaultValue={plant.imageCover}
                    required
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    name="price"
                    type="number"
                    defaultValue={plant.price}
                    required
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    name="quantity"
                    type="number"
                    defaultValue={plant.quantity || 0}
                    required
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    name="category"
                    defaultValue={plant.category || ""}
                    required
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    name="tag"
                    defaultValue={plant.tag || ""}
                    required
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    name="availability"
                    defaultValue={plant.availability || "In Stock"}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    name="color"
                    defaultValue={(plant.color || ["Green"]).join(", ")}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <div className="md:col-span-2">
                    <input
                      name="shortDescription"
                      defaultValue={plant.shortDescription || ""}
                      required
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={plant.description || ""}
                      required
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <textarea
                      name="plantCareTips"
                      rows={2}
                      defaultValue={(plant.plantCareTips || []).join(", ")}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Update Plant
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                    <Image
                      src={plant.imageCover}
                      alt={plant.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <form action={deletePlantAction}>
                    <input type="hidden" name="id" value={plant._id} />
                    <button
                      type="submit"
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                    >
                      Delete Plant
                    </button>
                  </form>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
