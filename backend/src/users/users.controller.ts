import { Body, Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./create-user-dto";

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
  ) { }

  @Get("/")
  findAll() {
    return this.userService.findAllUser();
  }

  @Get("/hi")
  getHi() {
    return { message: "Hello Bilel from docker" };
  }
}
