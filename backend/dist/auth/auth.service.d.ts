import { B2BSignUpDto } from 'src/users/signup.dto';
import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private readonly usersService;
    constructor(usersService: UsersService);
    signupB2b(dto: B2BSignUpDto): Promise<import("../users/user.entity").User>;
}
