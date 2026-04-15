"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { AdminPlant } from "@/lib/admin-api";
import {
  createAdminPlant,
  deleteAdminPlant,
  getAdminPlants,
  updateAdminPlant,
  uploadAdminImage,
} from "@/lib/admin-api";
import { readAuthCookie } from "@/lib/auth-cookie";
import PlantDialog, {
  type PlantFormData,
} from "@/components/admin/plants/plant-dialog";
import PlantTable from "@/components/admin/plants/plant-table";

const defaultFormData: PlantFormData = {
  name: "",
  imageCover: null,
  imagePreview: "",
  price: 0,
  quantity: 0,
  createdAt: new Date().toISOString(),
  plantCareTips: ["", "", "", ""],
  shortDescription: "",
  description: "",
  category: "",
  tag: "",
  availability: "In Stock",
  plantId: "",
};

type AdminPlantsPageProps = {
  initialPlants: AdminPlant[];
  initialToken: string;
};

export default function AdminPlantsPage({
  initialPlants,
  initialToken,
}: AdminPlantsPageProps) {
  const session = useMemo(() => readAuthCookie(), []);
  const token = session?.token || initialToken;

  const [plants, setPlants] = useState<AdminPlant[]>(initialPlants);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<AdminPlant | null>(null);
  const [plantToDelete, setPlantToDelete] = useState<AdminPlant | null>(null);
  const [formData, setFormData] = useState<PlantFormData>(defaultFormData);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const fetchPlants = useCallback(async () => {
    setLoading(true);
    clearMessages();

    try {
      const data = await getAdminPlants();
      setPlants(data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch plants data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPlants();
  }, [fetchPlants]);

  const handleOpenDialog = (plant: AdminPlant | null) => {
    clearMessages();
    setSelectedPlant(plant);

    if (plant) {
      setFormData({
        name: plant.name || "",
        imageCover: plant.imageCover || null,
        imagePreview: plant.imageCover || "",
        price: plant.price || 0,
        quantity: plant.quantity || 0,
        createdAt: plant.createdAt || new Date().toISOString(),
        plantCareTips: Array.isArray(plant.plantCareTips)
          ? [...plant.plantCareTips, "", "", "", ""].slice(0, 4)
          : ["", "", "", ""],
        shortDescription: plant.shortDescription || "",
        description: plant.description || "",
        category: plant.category || "",
        tag: plant.tag || "",
        availability: plant.availability || "In Stock",
        plantId: plant._id,
      });
    } else {
      setFormData(defaultFormData);
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPlant(null);
    setFormData(defaultFormData);
  };

  const handleSave = async (payload: PlantFormData) => {
    if (!token) {
      setError("Missing admin token. Please login again.");
      return;
    }

    clearMessages();

    try {
      let imageCover =
        typeof payload.imageCover === "string" ? payload.imageCover : "";

      if (payload.imageCover instanceof File) {
        imageCover = await uploadAdminImage(payload.imageCover);
      }

      const requestPayload = {
        name: payload.name,
        price: Number(payload.price),
        quantity: Number(payload.quantity),
        shortDescription: payload.shortDescription,
        description: payload.description,
        category: payload.category,
        tag: payload.tag,
        availability: payload.availability,
        imageCover,
        color: ["Green"],
        plantCareTips: payload.plantCareTips.filter((tip) => tip.trim() !== ""),
      };

      if (selectedPlant) {
        await updateAdminPlant(token, selectedPlant._id, requestPayload);
        setSuccess("Plant updated successfully!");
      } else {
        await createAdminPlant(token, requestPayload);
        setSuccess("Plant added successfully!");
      }

      await fetchPlants();
      handleCloseDialog();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : `Failed to ${selectedPlant ? "update" : "add"} plant`,
      );
    }
  };

  const handleAskDelete = (plant: AdminPlant) => {
    clearMessages();
    setPlantToDelete(plant);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!plantToDelete?._id || !token) {
      setConfirmOpen(false);
      return;
    }

    clearMessages();

    try {
      await deleteAdminPlant(token, plantToDelete._id);
      setSuccess("Plant deleted successfully!");
      await fetchPlants();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete plant",
      );
    } finally {
      setConfirmOpen(false);
      setPlantToDelete(null);
    }
  };

  return (
    <section className="m-0 mt-4 space-y-4 bg-[#f9fff9] p-0 sm:m-4 sm:space-y-5">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => handleOpenDialog(null)}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          Add New Plant
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm font-semibold text-slate-600">
            Loading plants...
          </p>
        </div>
      ) : plants.length === 0 ? (
        <div className="flex min-h-[100px] items-center justify-start">
          <p className="text-base font-semibold text-rose-600">
            No plants data found.
          </p>
        </div>
      ) : (
        <PlantTable
          plants={plants}
          onEdit={handleOpenDialog}
          onDelete={handleAskDelete}
        />
      )}

      {error ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <PlantDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        selectedPlant={selectedPlant}
        formData={formData}
        setFormData={setFormData}
      />

      {confirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Delete Plant</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete &quot;
              {plantToDelete?.name || "this plant"}&quot;?
            </p>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  setPlantToDelete(null);
                }}
                className="rounded-md px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
