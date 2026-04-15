import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <section className="flex items-center justify-center bg-green-50 px-4 py-10 md:px-8 md:py-16">
      <div className="w-full max-w-xl rounded-2xl bg-white px-4 py-8 text-center shadow-xl md:px-8 md:py-12">
        <div className="mb-4 flex justify-center">
          <span className="text-5xl text-green-500 md:text-7xl">✓</span>
        </div>

        <h1 className="mb-3 text-lg font-bold text-gray-800 md:text-2xl lg:text-3xl">
          Order Placed Successfully
        </h1>

        <p className="mb-4 px-2 text-xs text-gray-600 sm:text-base">
          Thank you for shopping with PlantWorld. Your order is being processed
          and confirmation will be shared shortly.
        </p>

        <p className="mb-6 text-xs text-gray-500 sm:text-base">
          Estimated Delivery: <span className="font-semibold">5-7 days</span>
        </p>

        <div className="flex flex-row justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 md:text-base"
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 md:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
