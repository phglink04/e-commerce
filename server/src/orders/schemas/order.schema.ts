import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { PaymentMethod, PaymentStatus } from "../../common/enums/payment.enum";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: "Plant", required: true })
  plantId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: "price must be an integer",
    },
  })
  price: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: "total must be an integer",
    },
  })
  total: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
export class OrderStatus {
  @Prop({
    required: true,
    enum: [
      "Pending Payment",
      "Order Received",
      "Processing",
      "Order Shipped",
      "Out for Delivery",
      "Order Delivered",
      "Order Cancelled",
    ],
  })
  stage: string;

  @Prop({ default: Date.now })
  changedAt: Date;
}

const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);

@Schema({ timestamps: false })
export class Order {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: "totalPrice must be an integer",
    },
  })
  totalPrice: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: "orderTotal must be an integer",
    },
  })
  orderTotal: number;

  @Prop({ required: true })
  paymentId: string;

  @Prop({
    type: String,
    enum: Object.values(PaymentMethod),
    default: PaymentMethod.BANK_TRANSFER,
  })
  paymentMethod: PaymentMethod;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Prop({ required: true, unique: true })
  referenceCode: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  expectedDelivery: Date;

  @Prop({ type: [OrderStatusSchema], default: [{ stage: "Order Received" }] })
  status: OrderStatus[];

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  mobile: string;

  @Prop()
  email: string;

  @Prop()
  addressLine1: string;

  @Prop()
  addressLine2?: string;

  @Prop()
  area: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  pincode: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
