import Image from "next/image";
import { formatVND } from "@/lib/currency";
import type { OrderItem } from "@/types/order";

interface OrderItemsProps {
  items: OrderItem[];
}

export default function OrderItems({ items }: OrderItemsProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="mb-5">
      <h4 className="mb-3 text-sm font-semibold text-slate-800 md:text-base">
        Items
      </h4>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const plant = typeof item.plantId === "string" ? null : item.plantId;
          const name = plant?.name || "Plant item";

          return (
            <li
              key={item._id}
              className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3"
            >
              {plant?.imageCover ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white">
                  <Image
                    src={plant.imageCover}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100 text-xs font-semibold text-emerald-800">
                  No image
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">{name}</p>
                <p className="text-sm text-slate-600">
                  Quantity: {item.quantity} × {formatVND(item.price)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
