import { API_BASE_URL } from "@/lib/config";
import type { AdminOrder, AdminUser } from "@/types/admin";

type ErrorShape = {
  message?: string;
};

async function parseError(response: Response) {
  const json = (await response.json().catch(() => ({}))) as ErrorShape;
  return json.message || "Request failed";
}

export async function getAdminOrders(token: string): Promise<AdminOrder[]> {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const json = (await response.json()) as {
    orders?: AdminOrder[];
  };

  return json.orders ?? [];
}

export async function getDeliveryOrders(token: string): Promise<AdminOrder[]> {
  return getAdminOrders(token);
}

export async function updateAdminOrderStatus(
  token: string,
  orderId: string,
  newStatus: string,
) {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newStatus }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function getAdminUsers(token: string): Promise<AdminUser[]> {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const json = (await response.json()) as {
    data?: {
      users?: AdminUser[];
    };
  };

  return json.data?.users ?? [];
}

export type AdminFaq = {
  _id: string;
  question: string;
  answer: string;
};

export async function getAdminFaqs(): Promise<AdminFaq[]> {
  const response = await fetch(`${API_BASE_URL}/api/faqs`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const json = (await response.json()) as {
    data?: {
      faqs?: AdminFaq[];
    };
  };

  return json.data?.faqs ?? [];
}

export async function createAdminFaq(
  token: string,
  payload: { question: string; answer: string },
) {
  const response = await fetch(`${API_BASE_URL}/api/faqs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function updateAdminFaq(
  token: string,
  id: string,
  payload: { question: string; answer: string },
) {
  const response = await fetch(`${API_BASE_URL}/api/faqs/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function deleteAdminFaq(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/api/faqs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export type AdminPlant = {
  _id: string;
  name: string;
  imageCover: string;
  price: number;
  quantity?: number;
  createdAt?: string;
  category?: string;
  tag?: string;
  shortDescription?: string;
  description?: string;
  availability?: string;
  color?: string[];
  plantCareTips?: string[];
};

export async function getAdminPlants(): Promise<AdminPlant[]> {
  const response = await fetch(`${API_BASE_URL}/api/plants`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const json = (await response.json()) as {
    data?: {
      plants?: AdminPlant[];
    };
  };

  return json.data?.plants ?? [];
}

export async function createAdminPlant(
  token: string,
  payload: {
    name: string;
    price: number;
    quantity: number;
    shortDescription: string;
    description: string;
    category: string;
    tag: string;
    availability: string;
    imageCover: string;
    color: string[];
    plantCareTips: string[];
  },
) {
  const response = await fetch(`${API_BASE_URL}/api/plants`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function updateAdminPlant(
  token: string,
  id: string,
  payload: Partial<{
    name: string;
    price: number;
    quantity: number;
    shortDescription: string;
    description: string;
    category: string;
    tag: string;
    availability: string;
    imageCover: string;
    color: string[];
    plantCareTips: string[];
  }>,
) {
  const response = await fetch(`${API_BASE_URL}/api/plants/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function deleteAdminPlant(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/api/plants/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function uploadAdminImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);

  const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const json = (await response.json()) as {
    publicUrl?: string;
    file?: { publicUrl?: string; url?: string };
  };

  const imageUrl = json.publicUrl || json.file?.publicUrl || json.file?.url;

  if (!imageUrl) {
    throw new Error("Image upload succeeded but URL is missing");
  }

  return imageUrl;
}

export async function addDeliveryPartner(
  token: string,
  payload: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    passwordConfirm: string;
  },
) {
  const response = await fetch(
    `${API_BASE_URL}/api/users/add-delivery-partner`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function deleteDeliveryPartner(token: string, userId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/users/delivery-partner/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}
