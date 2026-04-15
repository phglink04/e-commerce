import { IsMongoId, IsNumber, IsOptional, Min } from "class-validator";

export class UpdateCartDto {
  @IsMongoId()
  plantId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
