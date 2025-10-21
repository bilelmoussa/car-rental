import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user-decorator';

@ApiTags("company")
@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
  ) { }

  @Public()
  @Get()
  @ApiOperation({ summary: "Get all companies" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of all companies",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Unexpected server error",
  })
  async findAll() {
    return this.companyService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async add(@Body() dto: CreateCompanyDto, @CurrentUser() user: any) {
    return this.companyService.createCompany(dto, user.id);
  }
}
