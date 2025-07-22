import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateCompanyOwner } from './create-company-owner-dto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    hashData(data: string): Promise<string>;
    findAllUser(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    createCompanyOwnerUser(createCompanyOwnerDto: CreateCompanyOwner): Promise<User>;
}
