import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user-decorator";
import { Public } from "src/common/decorators/public.decorator";

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
  ) { }

  @Public()
  @Get("/")
  findAll() {
    return this.userService.findAllUser();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return { user };
  }

}
