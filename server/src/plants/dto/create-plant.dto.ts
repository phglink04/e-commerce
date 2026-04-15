import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreatePlantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  ratingsAverage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  ratingsQuantity?: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsArray()
  @IsString({ each: true })
  color: string[];

  @IsString()
  imageCover: string;

  @IsArray()
  @IsString({ each: true })
  plantCareTips: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceDiscount?: number;
}
