import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from 'src/users/dtos/signup.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { JwtPayload } from '../strategies/jwt.strategy';
import { AuthResponseDto, LoginDto, RefreshResponseDto, RefreshTokenDto } from '../dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Role } from 'src/users/enums/Role'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }


  async signup(dto: SignUpDto): Promise<AuthResponseDto> {
    const {
      firstName,
      lastName,
      email,
      gender,
      password,
    } = dto;

    const emailInUse = await this.usersService.findPasswordByEmail(email);

    if (emailInUse) {
      throw new BadRequestException("User with this email already exists");
    }

    const newUser = await this.usersService.createUser({
      firstName,
      lastName,
      email,
      gender,
      password,
      role: Role.UNASSIGNED
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

    const res = await this.generateTokens(user);

    return res;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshResponseDto> {
    const { refreshToken } = refreshTokenDto;

    const hashedToken = this.hashRefreshToken(refreshToken);

    const user = await this.usersService.findByRefreshToken(hashedToken);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValidRefreshToken = await this.validateRefreshToken(user.id, refreshToken);

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
    await this.revokeRefreshToken(userId);
  }

  async logoutFromAllDevices(userId: string): Promise<void> {
    // this is for later use
    await this.revokeRefreshToken(userId);
  }

  private async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findPasswordByEmail(email);

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

    const refreshToken = this.generateRefreshToken();

    await this.updateRefreshToken(user.id, refreshToken);

    const refreshTokenExpireAt = await this.usersService.findRefreshTokenExpireAt(user.id)

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      refreshTokenExpireAt: refreshTokenExpireAt,
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

  // Refresh Token functions
  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  private hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private getRefreshTokenExpiry(): Date {
    const expiryDays = 7;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + expiryDays);
    return expiry;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    const updateData: Partial<User> = {
      refreshToken: refreshToken ? this.hashRefreshToken(refreshToken) : null,
      refreshTokenExpiresAt: refreshToken ? this.getRefreshTokenExpiry() : null,
    };
    await this.usersService.update(userId, updateData);
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);

    if (!user.refreshToken || !user.refreshTokenExpiresAt) {
      return false;
    }

    if (new Date() > user.refreshTokenExpiresAt) {
      await this.updateRefreshToken(userId, null);
      return false;
    }

    const hashedToken = this.hashRefreshToken(refreshToken);
    return user.refreshToken === hashedToken;
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    await this.updateRefreshToken(userId, null);
  }
} 
