import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { B2BSignUpDto } from 'src/users/signup.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './jwt.strategy';
import { AuthResponseDto, LoginDto, RefreshResponseDto, RefreshTokenDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly companyService: CompanyService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async signupB2b(dto: B2BSignUpDto) {
    const {
      firstName,
      lastName,
      email,
      gender,
      password,
    } = dto;

    const emailInUse = await this.usersService.findByEmail(email);

    if (emailInUse) {
      throw new BadRequestException("User with this email already exists");
    }

    const newUser = await this.usersService.createCompanyOwnerUser({
      firstName,
      lastName,
      email,
      gender,
      password,
    });

    const tokens = this.generateTokens(newUser);

    return tokens;
  }

  async signIn(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(user.id);

    return this.generateTokens(user);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshResponseDto> {
    const { refreshToken } = refreshTokenDto;

    const user = await this.usersService.findByRefreshToken(refreshToken);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValidRefreshToken = await this.usersService.validateRefreshToken(user.id, refreshToken);

    if (!isValidRefreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokens = await this.generateTokens(user);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    }
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.revokeRefreshToken(userId);
  }

  async logoutFromAllDevices(userId: string): Promise<void> {
    // this is for later use
    await this.usersService.revokeRefreshToken(userId);
  }

  private async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  private async generateTokens(user: User): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m'),
    });

    const refreshToken = this.usersService.generateRefreshToken();

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }
    }
  }

  async generateNewAccessToken(userId: string): Promise<string> {
    const user = await this.usersService.findById(userId);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m'),
    })
  }

} 
