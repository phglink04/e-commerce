"use client";

import { useMemo, useState } from "react";

import type { AdminPlant } from "@/lib/admin-api";

type PlantFormData = {
  name: string;
  imageCover: File | string | null;
  imagePreview: string;
  price: number;
  quantity: number;
  createdAt: string;
  plantCareTips: string[];
  shortDescription: string;
  description: string;
  category: string;
  tag: string;
  availability: string;
  plantId: string;
};

type PlantDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (formData: PlantFormData) => Promise<void>;
  selectedPlant: AdminPlant | null;
  formData: PlantFormData;
  setFormData: React.Dispatch<React.SetStateAction<PlantFormData>>;
};

const categories = [
  "Flowering Plants",
  "Foliage Plants",
  "Ferns",
  "Herbs",
  "Fruit Plants",
  "Succulent Plants",
  "Vegetables & Herbs",
  "Climbing Plants",
  "Creepers",
  "Succulents & Cacti",
  "Climbers",
];

const tags = ["Indoor", "Outdoor"];
const availabilityOptions = ["In Stock", "Out Of Stock", "Up Coming"];

export default function PlantDialog({
  open,
  onClose,
  onSave,
  selectedPlant,
  formData,
  setFormData,
}: PlantDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const createdAtText = useMemo(() => {
    if (!formData.createdAt) return "-";
    const parsed = new Date(formData.createdAt);
    if (Number.isNaN(parsed.getTime())) return "-";
    return new Intl.DateTimeFormat("en-GB").format(parsed);
  }, [formData.createdAt]);

  function handleInputChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      imageCover: file,
      imagePreview: URL.createObjectURL(file),
    }));
    setErrors((prev) => ({ ...prev, imageCover: "" }));
  }

  function handleCareTipChange(index: number, value: string) {
    const updatedTips = [...(formData.plantCareTips || [])];
    updatedTips[index] = value;
    setFormData((prev) => ({ ...prev, plantCareTips: updatedTips }));
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};

    if (!selectedPlant && !(formData.imageCover instanceof File)) {
      nextErrors.imageCover = "Please upload an image";
    }

    if (!formData.name?.trim()) nextErrors.name = "Plant name is required";
    if (!(Number(formData.price) >= 0))
      nextErrors.price = "Enter a valid price";
    if (!(Number(formData.quantity) >= 0))
      nextErrors.quantity = "Enter a valid quantity";
    if (!formData.category) nextErrors.category = "Select category";
    if (!formData.tag) nextErrors.tag = "Select tag";
    if (!formData.description?.trim())
      nextErrors.description = "Description is required";
    if (!formData.shortDescription?.trim()) {
      nextErrors.shortDescription = "Short Description is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const submitData: PlantFormData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        plantCareTips: (formData.plantCareTips || []).filter(
          (tip) => tip.trim() !== "",
        ),
      };

      await onSave(submitData);
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-green-600 md:text-xl">
            {selectedPlant ? "Edit Plant Details" : "Add New Plant"}
          </h2>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div>
            <label
              htmlFor="plant-image"
              className="mb-1 block text-sm font-semibold text-green-600"
            >
              Upload Plant Image
            </label>
            <input
              id="plant-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              title="Upload plant image"
              aria-label="Upload plant image"
              className="block w-full text-sm"
            />
            {errors.imageCover ? (
              <p className="mt-1 text-xs text-rose-600">{errors.imageCover}</p>
            ) : null}

            {(formData.imagePreview || formData.imageCover) && (
              <img
                src={
                  formData.imagePreview ||
                  (typeof formData.imageCover === "string"
                    ? formData.imageCover
                    : "")
                }
                alt="Preview"
                className="mt-3 h-28 w-28 rounded-md border border-slate-300 object-cover"
              />
            )}
          </div>

          {selectedPlant ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label
                  htmlFor="plant-id"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Plant ID
                </label>
                <input
                  id="plant-id"
                  value={formData.plantId}
                  readOnly
                  title="Plant ID"
                  aria-label="Plant ID"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="created-at"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Created At
                </label>
                <input
                  id="created-at"
                  value={createdAtText}
                  readOnly
                  title="Created at"
                  aria-label="Created at"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label
                htmlFor="plant-name"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Plant Name
              </label>
              <input
                id="plant-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                title="Plant name"
                aria-label="Plant name"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
              {errors.name ? (
                <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="plant-price"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Price
              </label>
              <input
                id="plant-price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                title="Price"
                aria-label="Price"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
              {errors.price ? (
                <p className="mt-1 text-xs text-rose-600">{errors.price}</p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="plant-quantity"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Quantity
              </label>
              <input
                id="plant-quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                title="Quantity"
                aria-label="Quantity"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
              {errors.quantity ? (
                <p className="mt-1 text-xs text-rose-600">{errors.quantity}</p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="plant-category"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Category
              </label>
              <select
                id="plant-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                title="Category"
                aria-label="Category"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="">Select category</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.category ? (
                <p className="mt-1 text-xs text-rose-600">{errors.category}</p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="plant-tag"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Tag
              </label>
              <select
                id="plant-tag"
                name="tag"
                value={formData.tag}
                onChange={handleInputChange}
                title="Tag"
                aria-label="Tag"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="">Select tag</option>
                {tags.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.tag ? (
                <p className="mt-1 text-xs text-rose-600">{errors.tag}</p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="plant-availability"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Availability
              </label>
              <select
                id="plant-availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                title="Availability"
                aria-label="Availability"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                {availabilityOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="short-description"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Short Description
            </label>
            <input
              id="short-description"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              title="Short description"
              aria-label="Short description"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
            {errors.shortDescription ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.shortDescription}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              title="Description"
              aria-label="Description"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
            {errors.description ? (
              <p className="mt-1 text-xs text-rose-600">{errors.description}</p>
            ) : null}
          </div>

          <div>
            <p className="mb-1 text-sm font-semibold text-green-600">
              Plant Care Tips
            </p>
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                value={formData.plantCareTips?.[index] || ""}
                onChange={(e) => handleCareTipChange(index, e.target.value)}
                placeholder={`Tip ${index + 1}`}
                className="mb-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {selectedPlant ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export type { PlantFormData };
