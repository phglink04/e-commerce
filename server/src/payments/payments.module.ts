import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MailModule } from "../mail/mail.module";
import { Order, OrderSchema } from "../orders/schemas/order.schema";
import { User, UserSchema } from "../users/schemas/user.schema";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
