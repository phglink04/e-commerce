import Hero from "@/components/client/hero";
import PlantGrid from "@/components/client/plant-grid";
import { getFeaturedPlants } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredPlants = await getFeaturedPlants();

  return (
    <>
      <Hero />
      <PlantGrid plants={featuredPlants} title="Featured Products" />
    </>
  );
}
