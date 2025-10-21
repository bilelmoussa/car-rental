import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class CarModelResponseDto {
  @Expose()
  id: string;

  @Expose()
  brand: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  category: string;

  @Expose()
  seats: number;

  @Expose()
  transmission: string;

  @Expose()
  fuelType: string;

  @Expose()
  dailyRate: number;

  @Expose()
  description: string;

  @Expose()
  features: string[];

  @Expose()
  imageUrl: string;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}
