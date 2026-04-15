import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MailModule } from "../mail/mail.module";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";
import { Contact, ContactSchema } from "./schemas/contact.schema";

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
