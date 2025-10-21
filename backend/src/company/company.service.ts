import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { isUUID } from 'class-validator';
import { UsersService } from 'src/users/services/users.service';
import { Role } from 'src/users/enums/Role';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private readonly userService: UsersService
  ) { }

  async createCompany(companyDto: CreateCompanyDto, ownerId: string) {
    if (!isUUID(ownerId)) {
      throw new BadRequestException('Invalid UUID');
    }

    const user = await this.userService.findById(ownerId);

    if (!user) {
      throw new BadRequestException('User not found!')
    }

    // if (!user.emailVerified) {
    //   throw new BadRequestException('User email not verified!')
    // }

    if (user.role !== Role.UNASSIGNED || user.companyId) {
      throw new BadRequestException("User must be unassigned and not linked to any company before being added.")
    }

    const newCompany = this.companyRepository.create({
      name: companyDto.name,
      slug: companyDto.slug,
      email: companyDto.email,
      address: companyDto.address,
      country: companyDto.country,
      phoneNumber: companyDto.phoneNumber,
      registrationNumber: companyDto.registrationNumber,
      logoUrl: companyDto.logoUrl,
      isActive: true,
      ownerId: ownerId,
      employees: [user]
    });

    const savedCompany = await this.companyRepository.save(newCompany);

    if (savedCompany) {
      await this.userService.update(ownerId, {
        role: Role.COMPANYOWNER,
        companyId: savedCompany.id,
      })
    }

    return savedCompany;
  }

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find({
      relations: {
        carModels: true
      }
    });
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Car model with ID ${id} not found`);
    }
    return company;
  }

}
