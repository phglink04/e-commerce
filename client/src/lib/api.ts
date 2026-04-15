import { cache } from "react";

import { API_BASE_URL } from "@/lib/config";
import type { Plant } from "@/types/plant";

type ApiResponse<T> = {
  status: string;
  data?: T;
  results?: number;
};

export const getPlants = cache(async (): Promise<Plant[]> => {
  const response = await fetch(`${API_BASE_URL}/api/plants`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const json = (await response.json()) as ApiResponse<{ plants: Plant[] }>;
  return json.data?.plants ?? [];
});

export const getFeaturedPlants = cache(async (): Promise<Plant[]> => {
  const response = await fetch(`${API_BASE_URL}/api/plants/featured-products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const json = (await response.json()) as ApiResponse<{ plants: Plant[] }>;
  return json.data?.plants ?? [];
});

export const getPlantById = cache(
  async (plantId: string): Promise<Plant | null> => {
    const response = await fetch(`${API_BASE_URL}/api/plants/${plantId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as ApiResponse<{ plant: Plant }>;
    return json.data?.plant ?? null;
  },
);

export async function loginWithEmailPassword(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Login failed");
  }

  return json as {
    token: string;
    data: {
      user: {
        id: string;
        name: string;
        email: string;
        role: "user" | "admin" | "deliverypartner";
      };
    };
  };
}

export async function submitContact(payload: {
  name: string;
  email: string;
  contactNumber: string;
  message: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to submit contact form");
  }

  return response.json();
}

export async function updateCurrentUser(
  token: string,
  payload: { name: string; email?: string; phoneNumber?: string },
) {
  const response = await fetch(`${API_BASE_URL}/api/users/updateMe`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Failed to update profile");
  }

  return json as {
    status: string;
    data: {
      user: {
        id?: string;
        _id?: string;
        name: string;
        email: string;
        role: "user" | "admin" | "deliverypartner";
        phoneNumber?: string;
      };
    };
  };
}

export async function updateCurrentPassword(
  token: string,
  payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
) {
  const response = await fetch(`${API_BASE_URL}/api/users/updateMyPassword`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      password: payload.newPassword,
      passwordConfirm: payload.currentPassword,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Failed to update password");
  }

  return json;
}

export async function deleteCurrentUser(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/deleteMe`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 204 && !response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(json.message || "Failed to delete account");
  }

  return true;
}

export async function getFaqs() {
  const response = await fetch(`${API_BASE_URL}/api/faqs`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [] as Array<{ _id: string; question: string; answer: string }>;
  }

  const json = (await response.json()) as {
    data?: { faqs?: Array<{ _id: string; question: string; answer: string }> };
  };

  return json.data?.faqs ?? [];
}
