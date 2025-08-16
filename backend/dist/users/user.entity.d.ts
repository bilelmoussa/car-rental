import { Gender } from './enums/Gender';
import { Role } from './enums/Role';
import { Company } from 'src/company/company.entity';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: Gender;
    role: Role;
    password: string;
    dateOfBirth?: Date;
    phoneNumber?: string;
    country?: string;
    company?: Company;
    refreshToken: string | null;
    refreshTokenExpiresAt: Date | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
