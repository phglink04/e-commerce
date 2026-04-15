import { Controller, Get, Param } from "@nestjs/common";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get("qr/:orderId")
  getPaymentQr(@Param("orderId") orderId: string) {
    return this.paymentsService.generateVietQR(orderId);
  }

  @Get("verify/:orderId")
  verifyPayment(@Param("orderId") orderId: string) {
    return this.paymentsService.verifyOrderPayment(orderId);
  }
}
