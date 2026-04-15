import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PlantDocument = HydratedDocument<Plant>;

@Schema({ timestamps: false })
export class Plant {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ default: 4.5, min: 1, max: 5 })
  ratingsAverage: number;

  @Prop({ default: 0 })
  ratingsQuantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, trim: true })
  shortDescription: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ required: true, trim: true })
  tag: string;

  @Prop({ required: true, min: 0, default: 20 })
  quantity: number;

  @Prop({
    enum: ["In Stock", "Out Of Stock", "Up Coming"],
    default: "In Stock",
  })
  availability: string;

  @Prop({ type: [String], required: true })
  color: string[];

  @Prop({ required: true })
  imageCover: string;

  @Prop({ type: [String], required: true })
  plantCareTips: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  priceDiscount?: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PlantSchema = SchemaFactory.createForClass(Plant);

PlantSchema.path("priceDiscount").validate(function (value: number) {
  if (!value) {
    return true;
  }

  return value < this.price;
}, "Discount price should be below regular price");
