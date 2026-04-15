import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MailModule } from "../mail/mail.module";
import { Plant, PlantSchema } from "../plants/schemas/plant.schema";
import { User, UserSchema } from "../users/schemas/user.schema";
import { Order, OrderSchema } from "./schemas/order.schema";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: Plant.name, schema: PlantSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
