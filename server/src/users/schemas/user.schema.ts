import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { HydratedDocument, Types } from "mongoose";

import { Role } from "../../common/constants/roles.constant";

export type UserDocument = HydratedDocument<User> & {
  correctPassword(candidatePassword: string): Promise<boolean>;
  changedPasswordAfter(jwtTimestamp: number): boolean;
  createPasswordResetToken(): string;
};

@Schema({ _id: false })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: "Plant", required: true })
  plantId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true })
  total: number;
}

const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: false })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop()
  photo?: string;

  @Prop({ enum: Object.values(Role), default: Role.USER })
  role: Role;

  @Prop({ required: true, minlength: 8, select: false })
  password: string;

  @Prop({ required: true, unique: true, match: /^\d{10}$/ })
  phoneNumber: string;

  @Prop({ required: true, select: false })
  passwordConfirm: string;

  @Prop()
  passwordChangedAt?: Date;

  @Prop({ select: false })
  passwordResetToken?: string;

  @Prop({ select: false })
  passwordResetExpires?: Date;

  @Prop({ default: true, select: false })
  active: boolean;

  @Prop({ type: [CartItemSchema], default: [] })
  cart: CartItem[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Order" }], default: [] })
  orders: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function (next) {
  const user = this as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }

  user.password = await bcrypt.hash(user.password, 12);
  user.passwordConfirm = undefined as never;

  if (!user.isNew) {
    user.passwordChangedAt = new Date(Date.now() - 1000);
  }

  next();
});

UserSchema.pre(/^find/, function (this: any, next) {
  this.find({ active: { $ne: false } });
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password);
};

UserSchema.methods.changedPasswordAfter = function (
  jwtTimestamp: number,
): boolean {
  const user = this as UserDocument;

  if (!user.passwordChangedAt) {
    return false;
  }

  const changedAt = Math.floor(user.passwordChangedAt.getTime() / 1000);
  return jwtTimestamp < changedAt;
};

UserSchema.methods.createPasswordResetToken = function (): string {
  const crypto = require("crypto") as typeof import("crypto");
  const user = this as UserDocument;

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};
