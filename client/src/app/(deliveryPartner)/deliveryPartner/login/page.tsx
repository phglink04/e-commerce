import LoginForm from "@/components/client/login-form";

export default function DeliveryPartnerLoginPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-[#ecffed] p-2 md:p-4">
      <LoginForm role="deliverypartner" />
    </section>
  );
}
