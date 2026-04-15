export type AdminOrderStatus = {
  stage: string;
  changedAt?: string;
};

export type AdminOrderItem = {
  _id: string;
  quantity: number;
  price: number;
  total: number;
  plantId?: {
    _id: string;
    name: string;
    imageCover?: string;
  };
};

export type AdminOrder = {
  _id: string;
  user?: {
    _id: string;
    name?: string;
    email?: string;
  };
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  orderTotal: number;
  paymentId?: string;
  createdAt: string;
  expectedDelivery?: string;
  status: AdminOrderStatus[];
  items: AdminOrderItem[];
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "owner" | "deliverypartner";
  phoneNumber?: string;
  cart?: Array<unknown>;
};
