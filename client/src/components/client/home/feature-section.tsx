import { FaHeadset, FaLock, FaShippingFast, FaUndoAlt } from "react-icons/fa";

function FeatureItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="text-[#4d933e] text-4xl sm:text-5xl mb-2 sm:mb-3 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
        {icon}
      </div>
      <h5 className="text-xs md:text-base lg:text-xl font-bold text-[#333]">
        {title}
      </h5>
      <p className="text-xs md:text-sm text-[#666]">{subtitle}</p>
    </div>
  );
}

const FeatureSection = () => {
  return (
    <div className="py-8 mx-5 md:mt-4 md:mb-16">
      <div className="container px-4 py-3 bg-[#f5f7fa] rounded-lg shadow-lg">
        <div className="grid grid-cols-2 sm:grid-cols-4 text-center">
          <FeatureItem
            icon={<FaShippingFast />}
            title="Free delivery"
            subtitle="For all orders above Rs 1000"
          />
          <FeatureItem
            icon={<FaLock />}
            title="Secure payments"
            subtitle="Confidence on all your devices"
          />
          <FeatureItem
            icon={<FaHeadset />}
            title="Customer support"
            subtitle="Available 24/7"
          />
          <FeatureItem
            icon={<FaUndoAlt />}
            title="7 Days Return"
            subtitle="Hassle-free returns"
          />
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
