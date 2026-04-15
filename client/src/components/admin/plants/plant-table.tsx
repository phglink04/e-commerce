import { FaEdit, FaTrashAlt } from "react-icons/fa";

import { formatVND } from "@/lib/currency";
import type { AdminPlant } from "@/lib/admin-api";
import PlantImage from "@/components/shared/plant-image";

type PlantTableProps = {
  plants: AdminPlant[];
  onEdit: (plant: AdminPlant) => void;
  onDelete: (plant: AdminPlant) => void;
};

export default function PlantTable({
  plants,
  onEdit,
  onDelete,
}: PlantTableProps) {
  const dateFormatter = new Intl.DateTimeFormat("en-GB");

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-green-100 bg-white shadow-sm">
      <table className="min-w-[980px] w-full">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">No.</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Category
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Quantity
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Created At
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {plants.map((plant, index) => (
            <tr
              key={plant._id}
              className="border-b border-green-50 text-sm text-slate-700 hover:bg-green-50/60"
            >
              <td className="px-4 py-3 font-medium">{index + 1}</td>

              <td className="px-4 py-3">
                <div className="h-10 w-10 overflow-hidden rounded-md border border-slate-200">
                  <PlantImage src={plant.imageCover} alt={plant.name} />
                </div>
              </td>

              <td className="px-4 py-3 font-medium text-slate-900">
                {plant.name}
              </td>

              <td className="px-4 py-3">{plant.category || "-"}</td>

              <td className="px-4 py-3 text-slate-900">
                {formatVND(plant.price)}
              </td>

              <td className="px-4 py-3">{plant.quantity ?? 0}</td>

              <td className="px-4 py-3">
                {plant.createdAt
                  ? dateFormatter.format(new Date(plant.createdAt))
                  : "-"}
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    title="Edit"
                    aria-label="Edit"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => onEdit(plant)}
                  >
                    <FaEdit className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    title="Delete"
                    aria-label="Delete"
                    className="text-rose-600 hover:text-rose-700"
                    onClick={() => onDelete(plant)}
                  >
                    <FaTrashAlt className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
