import { UsersService } from "./users.service";
import { CreateUserDto } from "./create-user-dto";
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    findAll(): Promise<import("./user.entity").User[]>;
    addUser(createUserDto: CreateUserDto): Promise<import("./user.entity").User>;
}
