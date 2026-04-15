export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <section className="mx-auto max-w-xl px-4 py-12 md:px-8">
      <h1 className="text-3xl font-black text-slate-900">Reset Password</h1>
      <p className="mt-3 text-slate-600">Reset token: {token}</p>
      <p className="mt-3 text-sm text-slate-500">
        Implement final reset form posting to /api/users/resetPassword/:token.
      </p>
    </section>
  );
}
