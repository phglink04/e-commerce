export const dynamic = "force-dynamic";

import { getFaqs } from "@/lib/api";

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="text-success font-serif text-xl font-bold md:text-3xl lg:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-sm text-slate-600 md:text-base">
            Answers to the most common questions about shopping, delivery, and
            account management.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.length ? (
            faqs.map((faq) => (
              <details
                key={faq._id}
                className="rounded-lg border border-slate-200 bg-white px-5 py-4"
              >
                <summary className="cursor-pointer text-base font-semibold text-slate-900">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm text-slate-600">{faq.answer}</p>
              </details>
            ))
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
              No FAQs are available right now.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
