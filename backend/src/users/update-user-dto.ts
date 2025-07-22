import { PartialType } from "@nestjs/mapped-types";
import { CreateCompanyOwner } from "./create-company-owner-dto";

export class UpdateUserDto extends PartialType(CreateCompanyOwner) { }
