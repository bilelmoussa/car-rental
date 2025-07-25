import { B2BSignUpDto } from 'src/users/signup.dto';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto, RefreshResponseDto, RefreshTokenDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUpB2b(signupData: B2BSignUpDto): Promise<AuthResponseDto>;
    signIn(loginDto: LoginDto): Promise<AuthResponseDto>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<RefreshResponseDto>;
    logout(userId: string): Promise<void>;
    logoutFromAllDevices(userId: string): Promise<void>;
    getProfile(user: any): Promise<{
        user: any;
    }>;
    adminOnlyEndPoint(): Promise<{
        message: string;
    }>;
}
