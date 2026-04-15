"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CheckoutInvoiceDialog from "@/components/client/checkout/CheckoutInvoiceDialog";
import { readAuthCookie } from "@/lib/auth-cookie";
import { clearUserCart, fetchCart, fetchCartTotal } from "@/lib/cart-api";
import { createOrderAfterPayment } from "@/lib/checkout";
import { useCartStore } from "@/store/cart-store";

const labelClass = "mb-1 ml-1 text-[0.8rem] lg:text-[1.08rem]";
const inputClass =
  "text-success w-full px-[6px] py-[3px] lg:px-[12px] lg:py-[8px] mb-2 rounded border border-gray-300 text-[0.7rem] lg:text-[1rem] focus:border-green-500 focus:outline-none";
const gridRow = "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 md:gap-y-3";

export default function AddressFormPage() {
  const router = useRouter();
  const { cart, setCart, totalAmount, setTotalAmount, clearCart } =
    useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "CASH" | "TRANSFER"
  >("CASH");
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{
    id: string;
    amount: number;
  } | null>(null);
  const session = useMemo(() => readAuthCookie(), []);
  const user = session?.user;
  const token = session?.token || "";

  const [loadingCart, setLoadingCart] = useState(true);

  const fullName = user?.name || "";
  const [initialFirstName, initialLastName] = fullName.trim().split(" ", 2);

  const [form, setForm] = useState({
    firstName: initialFirstName || "",
    lastName: initialLastName || "",
    email: user?.email || "",
    mobile: user?.phoneNumber || "",
    addressLine1: "",
    addressLine2: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    const loadCart = async () => {
      setLoadingCart(true);
      try {
        const [items, total] = await Promise.all([
          fetchCart(token),
          fetchCartTotal(token),
        ]);
        setCart(items);
        setTotalAmount(total);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load cart for checkout",
        );
      } finally {
        setLoadingCart(false);
      }
    };

    void loadCart();
  }, [router, setCart, setTotalAmount, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Please login to continue checkout.");
      return;
    }

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "mobile",
      "addressLine1",
      "area",
      "city",
      "state",
      "pincode",
    ];
    for (const field of requiredFields) {
      if (!form[field as keyof typeof form]?.trim()) {
        setError("Please fill all shipping details before proceeding.");
        return;
      }
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!cart.length) {
      setError("Your cart is empty. Please add items before checkout.");
      return;
    }

    const total =
      totalAmount ||
      cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0,
      );

    if (total <= 0 || Number.isNaN(total)) {
      setError("Invalid cart total. Please review your cart.");
      return;
    }

    setError("");

    setIsSubmitting(true);
    try {
      const paymentMethod =
        selectedPaymentMethod === "TRANSFER" ? "BANK_TRANSFER" : "CASH";
      const paymentId =
        selectedPaymentMethod === "TRANSFER"
          ? `PENDING-${Date.now()}`
          : `CASH-${Date.now()}`;

      const orderResponse = await createOrderAfterPayment(token, {
        paymentId,
        paymentMethod,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        area: form.area.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      });

      const createdOrder = (orderResponse as { order?: { _id?: string } })
        .order;
      const orderId = createdOrder?._id;

      if (!orderId) {
        throw new Error("Cannot read created order id");
      }

      if (selectedPaymentMethod === "CASH") {
        await clearUserCart(token);
        clearCart();
        router.push("/order-success");
        return;
      }

      setPendingOrder({ id: orderId, amount: Math.round(total) });
      setShowCheckoutDialog(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Payment failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCart) {
    return (
      <div className="relative flex min-h-[60vh] items-center justify-center bg-[#ecffed]">
        <p className="text-sm font-semibold text-slate-700">
          Loading checkout...
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center bg-[#ecffed] min-h-[60vh]">
      <div className="flex flex-col w-[90%] md:w-[80%] max-w-[1200px] bg-white/80 rounded-[10px] shadow-lg mt-10 md:mt-12 mb-5 p-6 lg:p-10">
        <h2 className="text-success font-bold text-2xl md:text-3xl text-center mb-8 font-serif">
          Shipping Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={gridRow}>
            <div>
              <label className={labelClass}>First Name</label>
              <input
                required
                name="firstName"
                className={inputClass}
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
              />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input
                required
                name="lastName"
                className={inputClass}
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>
          </div>
          <div className={gridRow}>
            <div>
              <label className={labelClass}>Email</label>
              <input
                required
                name="email"
                type="email"
                className={`${inputClass} bg-gray-100`}
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                readOnly
              />
            </div>
            <div>
              <label className={labelClass}>Mobile</label>
              <input
                required
                name="mobile"
                className={inputClass}
                value={form.mobile}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>
          </div>
          <div className={gridRow}>
            <div>
              <label className={labelClass}>Address Line 1</label>
              <input
                required
                name="addressLine1"
                className={inputClass}
                value={form.addressLine1}
                onChange={handleChange}
                placeholder="123 Main St"
              />
            </div>
            <div>
              <label className={labelClass}>Address Line 2</label>
              <input
                name="addressLine2"
                className={inputClass}
                value={form.addressLine2}
                onChange={handleChange}
                placeholder="Apt 4B"
              />
            </div>
          </div>
          <div className={gridRow}>
            <div>
              <label className={labelClass}>Area</label>
              <input
                required
                name="area"
                className={inputClass}
                value={form.area}
                onChange={handleChange}
                placeholder="Downtown"
              />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input
                required
                name="city"
                className={inputClass}
                value={form.city}
                onChange={handleChange}
                placeholder="Mumbai"
              />
            </div>
          </div>
          <div className={gridRow}>
            <div>
              <label className={labelClass}>State</label>
              <input
                required
                name="state"
                className={inputClass}
                value={form.state}
                onChange={handleChange}
                placeholder="Maharashtra"
              />
            </div>
            <div>
              <label className={labelClass}>Pincode</label>
              <input
                required
                name="pincode"
                className={inputClass}
                value={form.pincode}
                onChange={handleChange}
                placeholder="400001"
                maxLength={6}
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 p-3">
            <p className="mb-2 text-sm font-medium text-emerald-900">
              Phuong thuc thanh toan
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH"
                  checked={selectedPaymentMethod === "CASH"}
                  onChange={() => setSelectedPaymentMethod("CASH")}
                />
                CASH (Tien mat)
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="TRANSFER"
                  checked={selectedPaymentMethod === "TRANSFER"}
                  onChange={() => setSelectedPaymentMethod("TRANSFER")}
                />
                TRANSFER (Chuyen khoan)
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Dang xu ly..." : "Thanh toan"}
            </button>
          </div>
        </form>
      </div>

      {pendingOrder && (
        <CheckoutInvoiceDialog
          open={showCheckoutDialog}
          orderId={pendingOrder.id}
          amount={pendingOrder.amount}
          token={token}
          onClose={() => setShowCheckoutDialog(false)}
          onPaidSuccess={async () => {
            await clearUserCart(token);
            clearCart();
            router.push("/order-success");
          }}
        />
      )}
    </div>
  );
}
