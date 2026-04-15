import Link from "next/link";

export default function EmptyOrdersMessage() {
  return (
    <div className="rounded-[1.5rem] border border-emerald-100 bg-white/85 p-8 text-center shadow-[0_20px_60px_rgba(16,185,129,0.12)]">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl">
        🛒
      </div>
      <p className="text-lg font-semibold text-slate-800 md:text-xl">
        You haven’t placed any orders yet.
      </p>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Browse the shop and pick something green for your space.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Shop Now
      </Link>
    </div>
  );
}
