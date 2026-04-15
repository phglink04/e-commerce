import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { MailService } from "../mail/mail.service";
import { Plant, PlantDocument } from "../plants/schemas/plant.schema";
import { User, UserDocument } from "../users/schemas/user.schema";
import { PaymentMethod, PaymentStatus } from "../common/enums/payment.enum";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { Order, OrderDocument } from "./schemas/order.schema";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Plant.name) private readonly plantModel: Model<PlantDocument>,
    private readonly mailService: MailService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const user = await this.userModel.findById(userId).populate("cart.plantId");

    if (!user || !user.cart || user.cart.length === 0) {
      throw new BadRequestException("Cart is empty");
    }

    const items = user.cart.map((item) => ({
      // Enforce integer VND values at write-time.
      price: this.ensureIntegerPrice(item.price),
      plantId: item.plantId as any,
      quantity: item.quantity,
      total: item.quantity * this.ensureIntegerPrice(item.price),
      plantName: (item.plantId as any).name,
    }));

    const orderTotal = items.reduce((sum, item) => sum + item.total, 0);
    const expectedDelivery = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000);
    const paymentMethod = dto.paymentMethod ?? PaymentMethod.BANK_TRANSFER;
    const isCashPayment = paymentMethod === PaymentMethod.CASH;
    const referenceCode = dto.referenceCode
      ? await this.ensureUniqueReferenceCode(dto.referenceCode)
      : await this.generateUniqueReferenceCode();

    const order = await this.orderModel.create({
      user: userId,
      items: items.map((item) => ({
        plantId: item.plantId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      totalPrice: orderTotal,
      orderTotal,
      paymentId: dto.paymentId,
      paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      referenceCode,
      expectedDelivery,
      status: [{ stage: isCashPayment ? "Order Received" : "Pending Payment" }],
      firstName: dto.firstName,
      lastName: dto.lastName,
      mobile: dto.mobile,
      email: dto.email,
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      area: dto.area,
      city: dto.city,
      state: dto.state,
      pincode: dto.pincode,
    });

    for (const item of items) {
      const plant = await this.plantModel.findById(item.plantId);
      if (!plant) {
        continue;
      }

      plant.quantity = Math.max(0, plant.quantity - item.quantity);
      if (plant.quantity === 0) {
        plant.availability = "Out Of Stock";
      }
      await plant.save({ validateBeforeSave: false });
    }

    user.orders.push(order._id as any);
    await user.save({ validateBeforeSave: false });

    if (!isCashPayment) {
      return {
        status: "success",
        order,
      };
    }

    user.cart = [];
    await user.save({ validateBeforeSave: false });

    const rows = items
      .map(
        (item, idx) => `
        <tr>
          <td style="padding:8px; border:1px solid #ddd;">${idx + 1}</td>
          <td style="padding:8px; border:1px solid #ddd;">${item.plantName}</td>
          <td style="padding:8px; border:1px solid #ddd;">${item.quantity}</td>
          <td style="padding:8px; border:1px solid #ddd;">INR ${item.price}</td>
          <td style="padding:8px; border:1px solid #ddd;">INR ${item.total}</td>
        </tr>
      `,
      )
      .join("");

    await this.mailService.sendEmail({
      email: dto.email,
      subject: "Your PlantWorld Order Confirmation",
      message: `
        <p>Hi <strong>${dto.firstName} ${dto.lastName}</strong>,</p>
        <p>Thank you for your order at PlantWorld.</p>
        <p><strong>Order Total:</strong> INR ${orderTotal}</p>
        <p><strong>Expected Delivery:</strong> ${expectedDelivery.toDateString()}</p>
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="padding:8px; border:1px solid #ddd; text-align:left;">#</th>
              <th style="padding:8px; border:1px solid #ddd; text-align:left;">Plant</th>
              <th style="padding:8px; border:1px solid #ddd; text-align:left;">Qty</th>
              <th style="padding:8px; border:1px solid #ddd; text-align:left;">Price</th>
              <th style="padding:8px; border:1px solid #ddd; text-align:left;">Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `,
    });

    return {
      status: "success",
      order,
    };
  }

  private ensureIntegerPrice(value: unknown): number {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0) {
      throw new BadRequestException(
        "Order price must be a non-negative integer (VND)",
      );
    }

    return parsed;
  }

  private generateReferenceCodeCandidate(): string {
    const ts = Date.now().toString().slice(-7);
    const random = Math.floor(100 + Math.random() * 900).toString();
    return `PLW${ts}${random}`;
  }

  private async ensureUniqueReferenceCode(
    referenceCode: string,
  ): Promise<string> {
    const exists = await this.orderModel.exists({ referenceCode });
    if (exists) {
      throw new BadRequestException("Reference code already exists");
    }

    return referenceCode;
  }

  private async generateUniqueReferenceCode(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const candidate = this.generateReferenceCodeCandidate();
      const exists = await this.orderModel.exists({ referenceCode: candidate });
      if (!exists) {
        return candidate;
      }
    }

    throw new BadRequestException("Could not generate unique reference code");
  }

  async getAllOrders() {
    const orders = await this.orderModel
      .find()
      .populate("items.plantId")
      .populate("user", "name email");

    return {
      status: "success",
      results: orders.length,
      orders,
    };
  }

  async getMyOrders(userId: string) {
    const orders = await this.orderModel
      .find({ user: userId })
      .populate("items.plantId");

    return {
      status: "success",
      results: orders.length,
      orders,
    };
  }

  async getOrderById(orderId: string) {
    const order = await this.orderModel
      .findById(orderId)
      .populate("items.plantId user");
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    return {
      status: "success",
      order,
    };
  }

  async getMyOrderById(userId: string, orderId: string) {
    const order = await this.orderModel
      .findOne({ _id: orderId, user: userId })
      .populate("items.plantId");

    if (!order) {
      throw new NotFoundException("Order not found or does not belong to you");
    }

    return {
      status: "success",
      order,
    };
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    order.status.push({
      stage: dto.newStatus,
      changedAt: new Date(),
    });

    await order.save();

    return {
      status: "success",
      message: `Order status updated to ${dto.newStatus}`,
      order,
    };
  }

  async cancelOrder(userId: string, orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (String(order.user) !== userId) {
      throw new ForbiddenException(
        "You are not authorized to cancel this order",
      );
    }

    const currentStage = order.status[order.status.length - 1]?.stage;
    if (currentStage !== "Order Received") {
      throw new BadRequestException(
        `Cannot cancel order. Current status is "${currentStage}". Only "Order Received" orders can be cancelled.`,
      );
    }

    order.status.push({ stage: "Order Cancelled", changedAt: new Date() });
    await order.save();

    return {
      status: "success",
      message: "Order cancelled successfully",
      order,
    };
  }
}
