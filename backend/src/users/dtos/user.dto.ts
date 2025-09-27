import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Gender } from '../enums/Gender';
import { Role } from '../enums/Role';

export class UserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(Role)
  role: Role;
}
