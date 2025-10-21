import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Car } from './cars.entity';
import { CarResponseDto } from './dtos/carResponse.dto';
import { CreateCarDto } from './dtos/createCar.dto';
import { InjectRepository } from '@nestjs/typeorm';


export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) { }

  async add(dto: CreateCarDto, userId: string): Promise<CarResponseDto> {
    const newCar = this.carRepository.create({
      companyId: dto.companyId,
      userId: userId,
      carModelId: dto.carModelId,
      licensePlate: dto.licensePlate,
      vin: dto.vin,
      color: dto.color,
      mileage: dto.mileage,
      status: dto.status,
      location: dto.location,
      lastServiceDate: dto.lastServiceDate,
      nextServiceDate: dto.nextServiceDate,
      notes: dto.notes
    })

    const savedCar = await this.carRepository.save(newCar);

    return savedCar;
  }
}
