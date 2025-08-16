import { Body, Post, Controller, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from 'src/users/dtos/signup.dto';
import { AuthService } from '../services/auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthResponseDto, LoginDto, RefreshResponseDto, RefreshTokenDto } from '../dtos/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user-decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from 'src/users/enums/Role';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags("authentication")
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post("local/signup")
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
  async signUpB2b(@Body() signupData: SignUpDto): Promise<AuthResponseDto> {
    return await this.authService.signup(signupData);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post("local/signin")
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: "Account signin (local)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User successfully signed in"
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication is required, or the provided credentials are invalid."
  })
  signIn(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.signIn(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<RefreshResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@CurrentUser('id') userId: string): Promise<void> {
    return this.authService.logout(userId);
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutFromAllDevices(@CurrentUser('id') userId: string): Promise<void> {
    return this.authService.logoutFromAllDevices(userId);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return { user };
  }

}
