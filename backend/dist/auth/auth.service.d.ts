import { CompanyService } from 'src/company/company.service';
import { B2BSignUpDto } from 'src/users/signup.dto';
import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private readonly usersService;
    private readonly companyService;
    constructor(usersService: UsersService, companyService: CompanyService);
    signupB2b(dto: B2BSignUpDto): Promise<{
        user: import("../users/user.entity").User;
        company: import("../company/company.entity").Company;
    }>;
}
