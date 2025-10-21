import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { CarCategory } from '../types/car-category.type';
import { TransmissionType } from '../types/transmission.type';
import { FuelType } from '../types/fuel.type';

export class QueryCarModelDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsEnum(CarCategory)
  category?: CarCategory;

  @IsOptional()
  @IsEnum(TransmissionType)
  transmission?: TransmissionType;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  minSeats?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  maxSeats?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minDailyRate?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  maxDailyRate?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}
