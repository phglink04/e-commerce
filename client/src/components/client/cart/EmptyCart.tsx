import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="text-center">
      <p className="text-gray-600 text-md md:text-xl font-semibold mb-4">
        Oops! Your cart is empty! 😔
      </p>
      <p className="text-gray-500 text-xs md:text-base lg:text-lg mb-6">
        It looks like you haven’t added anything to your cart yet. Don’t worry,
        there are plenty of plants waiting for you!
      </p>
      <Link href="/shop">
        <button className="btn btn-success text-xs md:text-base lg:text-lg mx-[10%] mt-[10%] md:mt-[3%] transform transition duration-300 hover:scale-105">
          Shop Now
        </button>
      </Link>
    </div>
  );
}
