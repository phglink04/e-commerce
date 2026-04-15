import DeliveryPartnerShell from "@/components/deliveryPartner/dp-shell";

export default function DeliveryPartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DeliveryPartnerShell>{children}</DeliveryPartnerShell>;
}
