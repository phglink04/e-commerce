import SettingsPanel from "@/components/client/settings-panel";

export default function SettingsPage() {
  return (
    <section className="bg-[#ecffed] py-2">
      <div className="mx-auto w-[92%] md:w-[88%] lg:w-[84%]">
        <div className="mb-4">
          <h1 className="text-success mt-3 text-center font-serif text-xl font-bold md:text-3xl">
            Account Settings
          </h1>
        </div>
        <SettingsPanel />
      </div>
    </section>
  );
}
