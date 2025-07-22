import { IsISO31661Alpha2, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator";
import { User } from "src/users/user.entity";


export class CompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  owner: User;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsISO31661Alpha2()
  country: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;
}
