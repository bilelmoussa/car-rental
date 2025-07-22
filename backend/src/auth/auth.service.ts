import { BadRequestException, Injectable } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { B2BSignUpDto } from 'src/users/signup.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly companyService: CompanyService
  ) { }

  async signupB2b(dto: B2BSignUpDto) {
    const {
      firstName,
      lastName,
      email,
      gender,
      password,
      companyName,
      address,
      country,
      phoneNumber,
    } = dto;

    const emailInUse = await this.usersService.findByEmail(email);

    if (emailInUse) {
      throw new BadRequestException("User already exist!");
    }

    const newUser = await this.usersService.createCompanyOwnerUser({
      firstName,
      lastName,
      email,
      gender,
      password,
    });

    const newCompany = await this.companyService.createCompany({
      name: companyName,
      address,
      country,
      phoneNumber,
      owner: newUser
    })

    console.log(newCompany)

    return { user: newUser, company: newCompany };
  }
} 
