import { CompanyService } from 'src/company/company.service';
import { B2BSignUpDto } from 'src/users/signup.dto';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto, LoginDto, RefreshResponseDto, RefreshTokenDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly usersService;
    private readonly companyService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, companyService: CompanyService, jwtService: JwtService, configService: ConfigService);
    signupB2b(dto: B2BSignUpDto): Promise<AuthResponseDto>;
    signIn(loginDto: LoginDto): Promise<AuthResponseDto>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshResponseDto>;
    logout(userId: string): Promise<void>;
    logoutFromAllDevices(userId: string): Promise<void>;
    private validateUser;
    private generateTokens;
    generateNewAccessToken(userId: string): Promise<string>;
}
