import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './cars.entity';
import { CarModelModule } from 'src/car-model/car-model.module';
import { UsersModule } from 'src/users/users.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car]),
  ],
  providers: [CarsService],
  controllers: [CarsController],
  exports: [CarsService]
})
export class CarsModule { }
