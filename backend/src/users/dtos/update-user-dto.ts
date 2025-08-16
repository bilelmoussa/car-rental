import { PartialType } from "@nestjs/mapped-types";
import { UserDto } from "./create-company-owner-dto";

export class UpdateUserDto extends PartialType(UserDto) { }
