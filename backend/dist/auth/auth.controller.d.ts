import { B2BSignUpDto } from 'src/users/signup.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUpB2b(signupData: B2BSignUpDto): Promise<import("../users/user.entity").User>;
}
