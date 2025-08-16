import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsISO31661Alpha2, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";
import { Gender } from "../enums/Gender";


const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;


export class SignUpDto {
  @ApiProperty({
    description: "The user's first name",
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  firstName: string;

  @ApiProperty({
    description: "The user's last name",
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  lastName: string;

  @ApiProperty({
    description: "The user's email address"
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The user's password"
  })
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character`,
  })
  password: string;

  @ApiProperty({
    description: "The user's gender",
    enum: Gender,
    enumName: 'Gender'
  })
  @IsEnum(Gender)
  gender: Gender;
}
