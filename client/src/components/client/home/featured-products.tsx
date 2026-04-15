import Link from "next/link";

import PlantImage from "@/components/shared/plant-image";
import { formatVND } from "@/lib/currency";
import type { Plant } from "@/types/plant";

type FeaturedProductsProps = {
  plants: Plant[];
};

export default function FeaturedProducts({ plants }: FeaturedProductsProps) {
  return (
    <div className="text-center px-4 lg:px-12">
      <h1 className="mt-8 md:mt-16 text-success font-bold text-2xl md:text-3xl lg:text-4xl font-serif">
        Featured Products
      </h1>
      <p className="w-full md:w-3/4 lg:w-2/3 mx-auto mt-8 text-sm md:text-base lg:text-lg">
        Discover our top trees, chosen for their beauty and resilience. Add
        color, fruit, or greenery to your garden with these customer favorites.
        Bring nature&apos;s charm home today.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8 mb-6">
        {plants.map((product) => (
          <ProductCard key={product._id} plant={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ plant }: { plant: Plant }) {
  return (
    <div className="rounded-md hover:shadow-xl transition-shadow duration-300 p-2 md:p-4 lg:p-5">
      <Link href={`/plant/description/${plant._id}`}>
        <PlantImage
          src={plant.imageCover}
          alt={plant.name}
          className="w-full h-40 md:h-48 lg:h-72 object-cover rounded-md hover:cursor-pointer"
        />
      </Link>
      <h3 className="mt-3 text-sm md:text-base lg:text-lg font-medium text-green-700">
        {plant.name}
      </h3>
      <div className="text-xs md:text-sm lg:text-base text-gray-700">
        {formatVND(plant.price)}
      </div>
    </div>
  );
}
