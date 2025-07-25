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
    findById(id: string): Promise<User>;
    findByRefreshToken(refreshToken: string): Promise<User | null>;
    updateLastLogin(id: string): Promise<void>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
    validateRefreshToken(userId: string, refreshToken: string): Promise<boolean>;
    revokeRefreshToken(userId: string): Promise<void>;
    private hashRefreshToken;
    private getRefreshTokenExpiry;
    generateRefreshToken(): string;
}
