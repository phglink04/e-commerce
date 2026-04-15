import LoginForm from "@/components/client/login-form";

export default function AdminLoginPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-[#ecffed] p-2 md:p-4">
      <LoginForm role="admin" />
    </section>
  );
}
