import { IsEmail, IsString } from "class-validator";
import { Transform } from 'class-transformer';


export class LoginDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class AuthResponseDto {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export class RefreshResponseDto {
  access_token: string;
  refresh_token: string;
}
