import { IsMongoId, IsNumber, Min } from "class-validator";

export class AddToCartDto {
  @IsMongoId()
  plantId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}
