import { Body, Controller, Get, Post } from "@nestjs/common";
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

  @Post("/add")
  addUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

}
