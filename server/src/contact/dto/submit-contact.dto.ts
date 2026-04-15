import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class SubmitContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @Matches(/^\d{3}-\d{3}-\d{4}$/)
  contactNumber: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
