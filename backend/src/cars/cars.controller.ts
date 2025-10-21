import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user-decorator';
import { CreateCarDto } from './dtos/createCar.dto';

@Controller('cars')
export class CarsController {
  constructor(
    private readonly carService: CarsService,
  ) { }


  @Post("/add")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async add(@Body() dto: CreateCarDto, @CurrentUser() user: any) {
    const result = await this.carService.add(dto, user.id);

    return { response: result }
  }
}
