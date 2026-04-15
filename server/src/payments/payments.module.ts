import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Order, OrderSchema } from "../orders/schemas/order.schema";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
