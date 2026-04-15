import ProfilePanel from "@/components/client/profile-panel";

export default function ProfilePage() {
  return (
    <section className="bg-[#ecffed] py-2">
      <div className="mx-auto w-[92%] md:w-[88%] lg:w-[84%]">
        <div className="mb-4">
          <h1 className="text-success mt-3 text-center font-serif text-xl font-bold md:text-3xl">
            My Profile
          </h1>
        </div>
        <ProfilePanel />
      </div>
    </section>
  );
}
