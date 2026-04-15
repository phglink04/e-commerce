import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ContactDocument = HydratedDocument<Contact>;

@Schema({ timestamps: false })
export class Contact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, lowercase: true })
  email: string;

  @Prop({ required: true, match: /^\d{3}-\d{3}-\d{4}$/ })
  contactNumber: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  submittedAt: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
