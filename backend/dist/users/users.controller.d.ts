import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    findAll(): Promise<import("./user.entity").User[]>;
    getHi(): {
        message: string;
    };
}
