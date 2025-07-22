import { Controller, Get, HttpStatus } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("company")
@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
  ) { }

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
}
