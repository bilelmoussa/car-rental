import { Repository } from 'typeorm';
import { User } from './user.entity';
import { B2BSignUpDto } from './signup.dto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    hashData(data: string): Promise<string>;
    findAllUser(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    create(createUserDto: B2BSignUpDto): Promise<User>;
}
