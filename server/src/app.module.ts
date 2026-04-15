import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthModule } from "./auth/auth.module";
import { CartModule } from "./cart/cart.module";
import { ContactModule } from "./contact/contact.module";
import { FaqsModule } from "./faqs/faqs.module";
import { ImagesModule } from "./images/images.module";
import { MailModule } from "./mail/mail.module";
import { OrdersModule } from "./orders/orders.module";
import { PaymentsModule } from "./payments/payments.module";
import { PlantsModule } from "./plants/plants.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
    }),
    MailModule,
    AuthModule,
    UsersModule,
    CartModule,
    PlantsModule,
    OrdersModule,
    FaqsModule,
    PaymentsModule,
    ContactModule,
    ImagesModule,
  ],
})
export class AppModule {}
