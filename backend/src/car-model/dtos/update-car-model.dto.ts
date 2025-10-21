import { CreateCarModelDto } from "./create-car-model.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateCarModelDto extends PartialType(CreateCarModelDto) { }
