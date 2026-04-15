import PlantImage from "@/components/shared/plant-image";
import { getPlantById } from "@/lib/api";

export default async function PlantDescriptionPage({
  params,
}: {
  params: Promise<{ plantId: string }>;
}) {
  const { plantId } = await params;
  const plant = await getPlantById(plantId);

  if (!plant) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-2xl font-bold">Plant not found</h1>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:px-8">
      <PlantImage
        src={plant.imageCover}
        alt={plant.name}
        className="h-[420px] rounded-xl"
        priority
      />

      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-700">
          {plant.category || "Plant"}
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-900">
          {plant.name}
        </h1>
        <p className="mt-4 text-2xl font-semibold text-emerald-700">
          Rs.{plant.price}
        </p>
        <p className="mt-5 text-slate-600">
          {plant.description || plant.shortDescription}
        </p>
      </div>
    </section>
  );
}
