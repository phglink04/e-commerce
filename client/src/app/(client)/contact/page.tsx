import ContactForm from "@/components/client/contact-form";

export default function ContactPage() {
  return (
    <section className="bg-[#ecffed] py-6">
      <div className="relative mx-auto flex w-[90%] max-w-[1200px] flex-col items-center justify-center rounded-[10px] bg-white/80 p-6 shadow-lg sm:flex-row md:w-[80%] md:mt-10 md:mb-5 lg:p-10">
        <div className="w-full sm:w-1/2">
          <h1 className="text-success text-center font-serif text-xl font-bold md:text-3xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-md text-center text-sm text-slate-600 md:text-base">
            Send us your question and PlantWorld team will respond as soon as
            possible.
          </p>
        </div>

        <div className="mt-6 flex w-full justify-center sm:mt-0 sm:w-1/2">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
