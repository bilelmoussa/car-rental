import { IsString, IsInt, IsEnum, IsNumber, IsOptional, IsArray, Min, Max, MaxLength, IsUrl, IsUUID } from "class-validator";
import { Type } from 'class-transformer';
import { CarCategory } from "../types/car-category.type";
import { TransmissionType } from "../types/transmission.type";
import { FuelType } from "../types/fuel.type";

export class CreateCarModelDto {
  @IsString()
  @MaxLength(100)
  brand: string;

  @IsString()
  @MaxLength(100)
  model: string

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  @Type(() => Number)
  year: number;

  @IsEnum(CarCategory)
  category: CarCategory;

  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  seats: number;

  @IsEnum(TransmissionType)
  transmission: TransmissionType;

  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  dailyRate: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @IsUUID()
  @IsString()
  companyId: string;

  @IsUUID()
  @IsString()
  userId: string;
}
