import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarModel } from './car-model.entity';
import { CreateCarModelDto } from './dtos/create-car-model.dto';
import { CarModelResponseDto } from './dtos/car-model-response.dto';
import { QueryCarModelDto } from './dtos/query-car-model.dto';
import { UpdateCarModelDto } from './dtos/update-car-model.dto';
import { CompanyService } from 'src/company/company.service';
import { UsersService } from 'src/users/services/users.service';

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
export class CarModelService {
  constructor(
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,

    private readonly companyRepository: CompanyService,
    private readonly userRepository: UsersService
  ) { }

  async add(dto: CreateCarModelDto, userId: string): Promise<CarModelResponseDto> {
    const newCarModel = this.carModelRepository.create({
      brand: dto.brand,
      model: dto.model,
      year: dto.year,
      category: dto.category,
      seats: dto.seats,
      transmission: dto.transmission,
      fuelType: dto.fuelType,
      dailyRate: dto.dailyRate,
      description: dto.description,
      features: dto.features,
      imageUrl: dto.imageUrl,
      companyId: dto.companyId,
      userId: userId,
    })

    const user = await this.userRepository.findById(newCarModel.userId);

    if (!user) {
      throw new BadRequestException('User not found!');
    }

    const company = await this.companyRepository.findOne(newCarModel.companyId);

    if (!company) {
      throw new BadRequestException('Company not found!')
    }

    const savedCarModel = await this.carModelRepository.save(newCarModel);

    return savedCarModel;
  }


  async getAll(query: QueryCarModelDto) {
    const {
      brand,
      model,
      year,
      category,
      transmission,
      fuelType,
      minSeats,
      maxSeats,
      minDailyRate,
      maxDailyRate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'DESC',
    } = query;

    // Build the query
    const queryBuilder = this.carModelRepository.createQueryBuilder('carModel');

    // Apply filters
    if (brand) {
      queryBuilder.andWhere('carModel.brand ILIKE :brand', { brand: `%${brand}%` });
    }

    if (model) {
      queryBuilder.andWhere('carModel.model ILIKE :model', { model: `%${model}%` });
    }

    if (year) {
      queryBuilder.andWhere('carModel.year = :year', { year });
    }

    if (category) {
      queryBuilder.andWhere('carModel.category = :category', { category });
    }

    if (transmission) {
      queryBuilder.andWhere('carModel.transmission = :transmission', { transmission });
    }

    if (fuelType) {
      queryBuilder.andWhere('carModel.fuelType = :fuelType', { fuelType });
    }

    // Seats range filter
    if (minSeats !== undefined && maxSeats !== undefined) {
      queryBuilder.andWhere('carModel.seats BETWEEN :minSeats AND :maxSeats', {
        minSeats,
        maxSeats,
      });
    } else if (minSeats !== undefined) {
      queryBuilder.andWhere('carModel.seats >= :minSeats', { minSeats });
    } else if (maxSeats !== undefined) {
      queryBuilder.andWhere('carModel.seats <= :maxSeats', { maxSeats });
    }

    // Daily rate range filter
    if (minDailyRate !== undefined && maxDailyRate !== undefined) {
      queryBuilder.andWhere('carModel.dailyRate BETWEEN :minDailyRate AND :maxDailyRate', {
        minDailyRate,
        maxDailyRate,
      });
    } else if (minDailyRate !== undefined) {
      queryBuilder.andWhere('carModel.dailyRate >= :minDailyRate', { minDailyRate });
    } else if (maxDailyRate !== undefined) {
      queryBuilder.andWhere('carModel.dailyRate <= :maxDailyRate', { maxDailyRate });
    }

    // Get total count before pagination
    const total = await queryBuilder.getCount();

    // Apply sorting
    queryBuilder.orderBy(`carModel.${sortBy}`, order);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const data = await queryBuilder.getMany();

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async findOne(id: string): Promise<CarModel> {
    const carModel = await this.carModelRepository.findOne({
      where: { id },
    });

    if (!carModel) {
      throw new NotFoundException(`Car model with ID ${id} not found`);
    }
    return carModel;
  }

  async update(id: string, updateCarModelDto: UpdateCarModelDto): Promise<CarModel> {
    const carModel = await this.findOne(id);

    // Check for conflicts if updating brand/model/year
    if (updateCarModelDto.brand || updateCarModelDto.model || updateCarModelDto.year) {
      const existing = await this.carModelRepository.findOne({
        where: {
          brand: updateCarModelDto.brand || carModel.brand,
          model: updateCarModelDto.model || carModel.model,
          year: updateCarModelDto.year || carModel.year,
        },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Car model with these details already exists');
      }
    }

    Object.assign(carModel, updateCarModelDto);
    return await this.carModelRepository.save(carModel);
  }

  async remove(id: string): Promise<void> {
    const carModel = await this.findOne(id);
    await this.carModelRepository.remove(carModel);
  }

  async search(searchTerm: string, limit: number = 10): Promise<CarModel[]> {
    return await this.carModelRepository
      .createQueryBuilder('carModel')
      .where('carModel.brand ILIKE :term OR carModel.model ILIKE :term', {
        term: `%${searchTerm}%`,
      })
      .limit(limit)
      .getMany();
  }

}



