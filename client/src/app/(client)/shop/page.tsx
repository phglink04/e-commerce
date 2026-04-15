import PlantGrid from "@/components/client/plant-grid";
import { getPlants } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop | PlantWorld",
};

export default async function ShopPage() {
  const plants = await getPlants();

  return (
    <section className="bg-[#ecffed] py-4">
      <div className="mx-auto w-[92%] md:w-[88%] lg:w-[84%]">
        <h1 className="text-success mt-3 text-center font-serif text-xl font-bold md:text-3xl">
          Shop Plants
        </h1>
      </div>
      <PlantGrid plants={plants} />
    </section>
  );
}
