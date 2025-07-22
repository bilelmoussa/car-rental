import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { CompanyDto } from './company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) { }

  async createCompany(companyDto: CompanyDto) {
    const newCompany = this.companyRepository.create({
      name: companyDto.name,
      address: companyDto.address,
      country: companyDto.country,
      phoneNumber: companyDto.phoneNumber,
      user: companyDto.owner,
      users: [companyDto.owner],
    });

    const savedCompany = await this.companyRepository.save(newCompany);

    return savedCompany;
  }

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find();
  }
}
