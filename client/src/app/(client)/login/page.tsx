import LoginForm from "@/components/client/login-form";

export default function LoginPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-[#ecffed] p-2 md:p-4">
      <div className="mt-16 mb-4 flex w-[90%] max-w-[1200px] flex-col rounded-[10px] bg-white/80 shadow-lg sm:flex-row lg:mt-10 md:mt-3 md:w-[80%]">
        <div className="flex flex-1 flex-col items-center justify-center bg-[#72a876] p-[20px] text-white md:rounded-l-[10px]">
          <h2 className="mb-[10px] text-center text-[16px] font-semibold md:text-[22px] lg:text-[32px]">
            Welcome to PlantWorld
          </h2>
          <p className="mb-[10px] text-[10px] md:mb-[22px] md:text-[13px] lg:mb-[30px] lg:text-[18px]">
            One stop for all the variety of plants
          </p>
          <div className="w-full max-w-[400px]">
            <img
              src="/frontend/Shop By Category/image-3.jpg"
              alt="Plant"
              className="w-full rounded-[10px]"
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center bg-[#f4f7f4] p-[20px] md:rounded-r-[10px] lg:p-[40px]">
          <LoginForm role="user" />
        </div>
      </div>
    </section>
  );
}
