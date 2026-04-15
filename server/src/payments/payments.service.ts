import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { PaymentMethod, PaymentStatus } from "../common/enums/payment.enum";
import { Order, OrderDocument } from "../orders/schemas/order.schema";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async generateVietQR(orderId: string, amount?: number) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    const orderAmount = this.ensureVndInteger(
      order.totalPrice ?? order.orderTotal,
    );
    const finalAmount =
      amount === undefined ? orderAmount : this.ensureVndInteger(amount);

    if (finalAmount !== orderAmount) {
      throw new BadRequestException("Amount does not match order total");
    }

    const referenceCode = `PLW${order._id.toString()}`;

    if (order.referenceCode !== referenceCode) {
      order.referenceCode = referenceCode;
    }

    order.paymentMethod = PaymentMethod.BANK_TRANSFER;
    order.paymentStatus = PaymentStatus.PENDING;
    await order.save();

    const bankBin = process.env.MB_BANK_BIN || "970422";
    const accountNo = process.env.MB_BANK_ACCOUNT_NO || "";
    const accountName = process.env.MB_BANK_ACCOUNT_NAME || "";
    const template = process.env.VIETQR_TEMPLATE || "compact2";

    if (!accountNo || !accountName) {
      throw new BadRequestException(
        "MB bank account info is missing. Please set MB_BANK_ACCOUNT_NO and MB_BANK_ACCOUNT_NAME",
      );
    }

    const qrImageUrl = `https://img.vietqr.io/image/${bankBin}-${accountNo}-${template}.png?amount=${finalAmount}&addInfo=${encodeURIComponent(referenceCode)}&accountName=${encodeURIComponent(accountName)}`;

    return {
      status: "success",
      paid: false,
      data: {
        orderId: order._id,
        amount: finalAmount,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentStatus: order.paymentStatus,
        referenceCode,
        bankName: process.env.MB_BANK_NAME || "MB Bank",
        accountNo,
        qrImageUrl,
      },
    };
  }

  async checkMBBankHistory(orderId: string, amount: number): Promise<boolean> {
    const normalizedAmount = this.ensureVndInteger(amount);
    const referenceCode = `PLW${orderId}`;

    // Mock mode for local development/testing.
    if (process.env.MB_BANK_MOCK_MATCH === "true") {
      return true;
    }

    const endpoint = process.env.MB_BANK_API_URL;
    const token = process.env.MB_BANK_API_TOKEN;

    if (!endpoint) {
      // No endpoint configured => treat as unpaid (integration placeholder).
      return false;
    }

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        return false;
      }

      const payload = (await response.json()) as {
        transactions?: Array<{
          amount?: number | string;
          description?: string;
          creditAmount?: number | string;
          transactionDesc?: string;
        }>;
      };

      const transactions = payload.transactions ?? [];

      return transactions.some((tx) => {
        const rawAmount = tx.amount ?? tx.creditAmount;
        const txAmount = Number(rawAmount);
        const txDescription =
          `${tx.description ?? ""} ${tx.transactionDesc ?? ""}`.toUpperCase();

        return (
          Number.isInteger(txAmount) &&
          txAmount === normalizedAmount &&
          txDescription.includes(referenceCode.toUpperCase())
        );
      });
    } catch {
      return false;
    }
  }

  async verifyOrderPayment(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    const amount = this.ensureVndInteger(order.totalPrice ?? order.orderTotal);
    const isPaid = await this.checkMBBankHistory(orderId, amount);

    if (!isPaid) {
      order.paymentStatus = PaymentStatus.PENDING;
      await order.save();
      return {
        status: "pending",
        paid: false,
        message: "Payment not found yet",
        data: {
          orderId: order._id,
          amount,
          paymentStatus: order.paymentStatus,
          referenceCode: order.referenceCode,
        },
      };
    }

    order.paymentMethod = PaymentMethod.BANK_TRANSFER;
    order.paymentStatus = PaymentStatus.PAID;
    if (!order.referenceCode?.startsWith("PLW")) {
      order.referenceCode = `PLW${order._id.toString()}`;
    }
    await order.save();

    return {
      status: "success",
      paid: true,
      message: "Payment verified successfully",
      data: {
        orderId: order._id,
        amount,
        paymentStatus: order.paymentStatus,
        referenceCode: order.referenceCode,
      },
    };
  }

  private ensureVndInteger(value: unknown): number {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0) {
      throw new BadRequestException(
        "Amount must be a non-negative integer in VND",
      );
    }

    return parsed;
  }
}
