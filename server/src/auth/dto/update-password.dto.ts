import { IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(8)
  passwordConfirm: string;
}
