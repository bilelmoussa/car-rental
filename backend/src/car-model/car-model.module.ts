import { Module } from '@nestjs/common';
import { CarModelService } from './car-model.service';
import { CarModelController } from './car-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModel } from './car-model.entity';
import { CompanyModule } from 'src/company/company.module';
import { UsersModule } from 'src/users/users.module';
import { CarsModule } from 'src/cars/cars.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarModel]),
    CompanyModule,
    UsersModule,
    CarsModule
  ],
  providers: [CarModelService],
  controllers: [CarModelController],
  exports: [CarModelService]
})
export class CarModelModule { }
