import { IsNotEmpty, IsString } from "class-validator";

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  newStatus: string;
}
