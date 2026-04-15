import { API_BASE_URL } from "@/lib/config";

function parseMessage(json: { message?: string }, fallback: string) {
  return json.message || fallback;
}

export async function createOrderAfterPayment(
  token: string,
  payload: {
    paymentId: string;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod?: "CASH" | "BANK_TRANSFER";
    referenceCode?: string;
  },
) {
  const endpoints = ["/api/orders", "/api/v1/orders"];

  for (const endpoint of endpoints) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return response.json();
    }

    if (response.status !== 404) {
      const json = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(parseMessage(json, "Failed to create order"));
    }
  }

  throw new Error("Failed to create order");
}

export type PaymentMethod = "CASH" | "TRANSFER";

export type PaymentQrData = {
  orderId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  referenceCode: string;
  qrImageUrl: string;
  bankName?: string;
  accountNo?: string;
};

export async function fetchPaymentQr(token: string, orderId: string) {
  const endpoints = [
    `${API_BASE_URL}/api/payments/qr/${orderId}`,
    `${API_BASE_URL}/payments/qr/${orderId}`,
  ];

  for (const endpoint of endpoints) {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        continue;
      }

      const json = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(parseMessage(json, "Failed to load payment QR"));
    }

    const json = (await response.json()) as { data?: PaymentQrData };
    if (!json.data?.qrImageUrl) {
      throw new Error("Invalid QR response from server");
    }

    return json.data;
  }

  throw new Error("Payment QR endpoint not found");
}

export async function verifyPaymentStatus(token: string, orderId: string) {
  const endpoints = [
    `${API_BASE_URL}/api/payments/verify/${orderId}`,
    `${API_BASE_URL}/payments/verify/${orderId}`,
  ];

  for (const endpoint of endpoints) {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        continue;
      }

      const json = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(parseMessage(json, "Failed to verify payment status"));
    }

    const json = (await response.json().catch(() => ({}))) as {
      status?: string;
      paid?: boolean;
      data?: {
        paymentStatus?: string;
      };
    };

    const paid =
      json.paid === true ||
      json.status === "success" ||
      json.data?.paymentStatus === "PAID";

    return { paid };
  }

  throw new Error("Payment verify endpoint not found");
}
