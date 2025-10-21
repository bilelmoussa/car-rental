import { Exclude, Expose, Type } from "class-transformer";
import { CarModel } from "src/car-model/car-model.entity";
import { CarModelResponseDto } from "src/car-model/dtos/car-model-response.dto";

// Nested DTOs for related entities
class CompanyNestedDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  logoUrl: string;

  @Expose()
  isActive: boolean;
}

class UserNestedDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}

@Exclude()
export class CarResponseDto {
  @Expose()
  id: string;

  @Expose()
  companyId: string;

  @Expose()
  @Type(() => CompanyNestedDto)
  company: CompanyNestedDto;

  @Expose()
  userId: string;

  @Expose()
  @Type(() => UserNestedDto)
  user: UserNestedDto;

  @Expose()
  carModelId: string;

  @Expose()
  licensePlate: string;

  @Expose()
  vin: string;

  @Expose()
  color: string;

  @Expose()
  mileage: number;

  @Expose()
  status: string;

  @Expose()
  location: string;

  @Expose()
  @Type(() => Date)
  lastServiceDate: Date;

  @Expose()
  @Type(() => Date)
  nextServiceDate: Date;

  @Expose()
  notes: string;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}
