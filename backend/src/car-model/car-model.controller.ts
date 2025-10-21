import { Body, Controller, Get, Post, Query, HttpCode, HttpStatus, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { CarModelService } from './car-model.service';
import { CreateCarModelDto } from './dtos/create-car-model.dto';
import { QueryCarModelDto } from './dtos/query-car-model.dto';
import { UpdateCarModelDto } from './dtos/update-car-model.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user-decorator';

@Controller('car-models')
export class CarModelController {
  constructor(
    private readonly carModelService: CarModelService,
  ) { }

  @Post("/add")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async add(@Body() dto: CreateCarModelDto, @CurrentUser() user: any) {
    const result = await this.carModelService.add(dto, user.id);

    return { response: result }
  }

  @Get()
  findAll(@Query() query: QueryCarModelDto) {
    return this.carModelService.getAll(query);
  }

  @Get('search')
  search(@Query('term') term: string, @Query('limit') limit?: number) {
    return this.carModelService.search(term, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carModelService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarModelDto: UpdateCarModelDto) {
    return this.carModelService.update(id, updateCarModelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.carModelService.remove(id);
  }
}
