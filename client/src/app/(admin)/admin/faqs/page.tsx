import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminFaq,
  deleteAdminFaq,
  getAdminFaqs,
  updateAdminFaq,
} from "@/lib/admin-api";
import { readServerSession } from "@/lib/server-session";

async function createFaqAction(formData: FormData) {
  "use server";

  const session = await readServerSession();
  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const question = String(formData.get("question") || "").trim();
  const answer = String(formData.get("answer") || "").trim();

  if (!question || !answer) {
    return;
  }

  await createAdminFaq(session.token, { question, answer });
  revalidatePath("/admin/faqs");
}

async function updateFaqAction(formData: FormData) {
  "use server";

  const session = await readServerSession();
  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") || "");
  const question = String(formData.get("question") || "").trim();
  const answer = String(formData.get("answer") || "").trim();

  if (!id || !question || !answer) {
    return;
  }

  await updateAdminFaq(session.token, id, { question, answer });
  revalidatePath("/admin/faqs");
}

async function deleteFaqAction(formData: FormData) {
  "use server";

  const session = await readServerSession();
  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") || "");
  if (!id) {
    return;
  }

  await deleteAdminFaq(session.token, id);
  revalidatePath("/admin/faqs");
}

export default async function ManageFaqsPage() {
  const session = await readServerSession();
  if (!session?.token || session.role !== "admin") {
    redirect("/admin/login");
  }

  const faqs = await getAdminFaqs();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Manage FAQs</h1>
        <p className="mt-2 text-slate-600">
          Create, edit, and remove frequently asked questions.
        </p>
      </div>

      <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Add New FAQ</h2>
        <form
          action={createFaqAction}
          className="mt-4 grid gap-3 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Question
            </label>
            <input
              name="question"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Write your FAQ question"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Answer
            </label>
            <textarea
              name="answer"
              required
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Write answer"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Add FAQ
            </button>
          </div>
        </form>
      </article>

      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            No FAQs found.
          </div>
        ) : (
          faqs.map((faq) => (
            <details
              key={faq._id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <summary className="cursor-pointer font-semibold text-slate-900">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm text-slate-700">{faq.answer}</p>

              <form
                action={updateFaqAction}
                className="mt-4 grid gap-2 md:grid-cols-2"
              >
                <input type="hidden" name="id" value={faq._id} />
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Question
                  </label>
                  <input
                    name="question"
                    required
                    defaultValue={faq.question}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Answer
                  </label>
                  <textarea
                    name="answer"
                    required
                    rows={3}
                    defaultValue={faq.answer}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Update
                  </button>
                </div>
              </form>

              <form action={deleteFaqAction} className="mt-2">
                <input type="hidden" name="id" value={faq._id} />
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  Delete FAQ
                </button>
              </form>
            </details>
          ))
        )}
      </div>
    </section>
  );
}
