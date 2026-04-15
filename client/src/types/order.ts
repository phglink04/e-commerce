export type OrderStatusStage =
  | "Order Received"
  | "Order Shipped"
  | "Out for Delivery"
  | "Order Delivered"
  | "Order Cancelled";

export interface OrderStatusEntry {
  stage: OrderStatusStage;
  changedAt?: string;
}

export interface OrderPlant {
  _id: string;
  name: string;
  imageCover: string;
}

export interface OrderItem {
  _id: string;
  plantId: OrderPlant | string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderSummary {
  _id: string;
  orderTotal: number;
  items: OrderItem[];
  status: OrderStatusEntry[];
  createdAt: string;
  paymentId: string;
  expectedDelivery: string;
}
