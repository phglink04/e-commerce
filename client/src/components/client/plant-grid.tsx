import Link from "next/link";

import PlantImage from "@/components/shared/plant-image";
import { formatVND } from "@/lib/currency";
import type { Plant } from "@/types/plant";

type PlantGridProps = {
  plants: Plant[];
  title?: string;
};

export default function PlantGrid({ plants, title }: PlantGridProps) {
  return (
    <section className="mx-auto mt-10 w-full max-w-7xl px-4 md:px-8">
      {title ? (
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
          {title}
        </h2>
      ) : null}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {plants.map((plant) => (
          <article
            key={plant._id}
            className="rounded-xl border border-slate-200 p-3 shadow-sm"
          >
            <Link href={`/plant/description/${plant._id}`}>
              <PlantImage
                src={plant.imageCover}
                alt={plant.name}
                className="h-44 w-full rounded-md"
              />
            </Link>
            <h3 className="mt-3 line-clamp-1 text-sm font-semibold text-slate-900 md:text-base">
              {plant.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {plant.category || "Plant"}
            </p>
            <p className="mt-2 text-emerald-700">{formatVND(plant.price)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
