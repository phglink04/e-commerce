import { API_BASE_URL } from "@/lib/config";
import type { CartItem } from "@/store/cart-store";

type ServerPlant = {
  _id: string;
  name: string;
  imageCover?: string;
};

type ServerCartItem = {
  _id?: string;
  plantId: string | ServerPlant;
  quantity: number;
  price: number;
  total: number;
};

type CartResponse = {
  status: string;
  message?: string;
  cart?: ServerCartItem[];
  cartTotal?: number;
};

function toErrorMessage(json: CartResponse, fallback: string) {
  return json.message || fallback;
}

export function mapServerCartToStore(items: ServerCartItem[] = []): CartItem[] {
  return items.map((item) => {
    const plant =
      typeof item.plantId === "string"
        ? { _id: item.plantId, name: "Plant", imageCover: "" }
        : item.plantId;

    return {
      id: item._id || plant._id,
      plantId: plant._id,
      name: plant.name,
      image: plant.imageCover || "/placeholder-plant.jpg",
      price: Number(item.price),
      quantity: Number(item.quantity),
      total: Number(item.total),
    };
  });
}

export async function fetchCart(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/cart`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = (await response.json().catch(() => ({}))) as CartResponse;

  if (!response.ok) {
    throw new Error(toErrorMessage(json, "Failed to fetch cart"));
  }

  return mapServerCartToStore(json.cart || []);
}

export async function fetchCartTotal(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/cart/total`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = (await response.json().catch(() => ({}))) as CartResponse;

  if (!response.ok) {
    throw new Error(toErrorMessage(json, "Failed to fetch cart total"));
  }

  return Number(json.cartTotal || 0);
}

export async function updateCartQuantity(
  token: string,
  plantId: string,
  quantity: number,
) {
  const response = await fetch(`${API_BASE_URL}/api/users/updatecart`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ plantId, quantity }),
  });

  const json = (await response.json().catch(() => ({}))) as CartResponse;

  if (!response.ok) {
    throw new Error(toErrorMessage(json, "Failed to update cart"));
  }

  return mapServerCartToStore(json.cart || []);
}

export async function removeCartItem(token: string, plantId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/users/deleteitem/${plantId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const json = (await response.json().catch(() => ({}))) as CartResponse;

  if (!response.ok) {
    throw new Error(toErrorMessage(json, "Failed to remove cart item"));
  }

  return mapServerCartToStore(json.cart || []);
}

export async function clearUserCart(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/clear-cart`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = (await response.json().catch(() => ({}))) as CartResponse;

  if (!response.ok) {
    throw new Error(toErrorMessage(json, "Failed to clear cart"));
  }

  return true;
}

export async function mergeUserCart(
  token: string,
  items: Array<{ plantId: string; quantity: number; price: number }>,
) {
  const response = await fetch(`${API_BASE_URL}/api/cart/merge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cartItems: items }),
  });

  const json = (await response.json().catch(() => ({}))) as CartResponse;

  if (!response.ok) {
    throw new Error(toErrorMessage(json, "Failed to merge cart"));
  }

  return mapServerCartToStore(json.cart || []);
}
