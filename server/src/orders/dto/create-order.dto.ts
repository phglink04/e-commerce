import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { PaymentMethod } from "../../common/enums/payment.enum";

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  plantId: string;

  @Type(() => Number)
  @IsInt()
  quantity: number;

  @Type(() => Number)
  @IsInt()
  price: number;

  @Type(() => Number)
  @IsInt()
  totalPrice: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Matches(/^\d{10}$/)
  mobile: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  pincode: string;

  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  @Matches(/^PLW[A-Z0-9]+$/)
  referenceCode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  totalPrice?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];
}
