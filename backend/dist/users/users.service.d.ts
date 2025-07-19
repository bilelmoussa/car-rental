import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user-dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    createUser(createUserdDto: CreateUserDto): Promise<User>;
    findAllUser(): Promise<User[]>;
}
