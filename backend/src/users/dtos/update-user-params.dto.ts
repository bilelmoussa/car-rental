import { IsUUID } from "class-validator";

export class UpdateUserParams {
  @IsUUID()
  id: string;
}
