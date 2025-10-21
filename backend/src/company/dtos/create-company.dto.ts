import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from "class-validator";
import { User } from "src/users/entities/user.entity";

export class CreateCompanyDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug can only contain lowercase letters, numbers, and hyphens (no spaces or special characters).',
  })
  slug: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MaxLength(500)
  address: string;

  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @Matches(/^[A-Z]{2}$/, { message: 'Country must be a valid 2-letter ISO code (e.g., US, GB, FR)' })
  country: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid international format' })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  registrationNumber?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  logoUrl?: string;
}
