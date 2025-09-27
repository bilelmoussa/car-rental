import { Gender } from "../enums/Gender";
import { Role } from "../enums/Role";

export type UserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: Gender;
  role: Role;
};

