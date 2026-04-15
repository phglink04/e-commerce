import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-lime-50 to-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Indoor and Outdoor
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-900 md:text-6xl">
            Grow Your Space
            <br />
            With Living Green
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-600">
            Explore handpicked plants, easy care guides, and fast delivery from
            PlantWorld.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/shop"
              className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="rounded-md border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-800"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
