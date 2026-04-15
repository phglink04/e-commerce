import { Type } from "class-transformer";
import {
  IsArray,
  IsMongoId,
  IsNumber,
  Min,
  ValidateNested,
} from "class-validator";

export class MergeCartItemDto {
  @IsMongoId()
  plantId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class MergeCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MergeCartItemDto)
  cartItems: MergeCartItemDto[];
}
