import { Body, Post, Controller, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { B2BSignUpDto } from 'src/users/signup.dto';
import { AuthService } from './auth.service';

@ApiTags("authentication")
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @HttpCode(HttpStatus.CREATED)
  @Post("local/b2b/signup")
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: "Account signup (local)" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Account successfully registred."
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid input data!"
  })
  async signUpB2b(@Body() signupData: B2BSignUpDto) {
    return await this.authService.signupB2b(signupData);
  }

}
