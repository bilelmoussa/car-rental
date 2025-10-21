import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Length, MaxLength } from "class-validator";

export class CreateCarDto {
  @IsUUID()
  @IsString()
  companyId: string;

  @IsUUID()
  @IsString()
  userId: string;

  @IsUUID()
  @IsString()
  carModelId: string;

  @IsString()
  @MaxLength(50)
  licensePlate: string;

  @IsString()
  @MaxLength(17)
  vin: string

  @IsString()
  @Length(1, 50)
  color: string;

  @IsNumber()
  @Type(() => Number)
  mileage: number;

  @IsString()
  @IsEnum(['available', 'rented', 'maintenance', 'out_of_service'])
  status: 'available' | 'rented' | 'maintenance' | 'out_of_service' = 'available';

  @IsString()
  @Length(1, 100)
  location: string;

  @IsDateString()
  lastServiceDate: string;

  @IsDateString()
  nextServiceDate: string;

  @IsString()
  notes: string;
}
