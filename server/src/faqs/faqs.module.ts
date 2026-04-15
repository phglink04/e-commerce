import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Faq, FaqSchema } from "./schemas/faq.schema";
import { FaqsController } from "./faqs.controller";
import { FaqsService } from "./faqs.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Faq.name, schema: FaqSchema }])],
  controllers: [FaqsController],
  providers: [FaqsService],
})
export class FaqsModule {}
