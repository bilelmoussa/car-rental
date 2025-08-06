import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from './Role';
import { CreateCompanyOwner } from './create-company-owner-dto';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  hashData(data: string) {
    return bcrypt.hash(data, 12);
  }

  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      }
    });
  }

  async createCompanyOwnerUser(createCompanyOwnerDto: CreateCompanyOwner) {
    const { email, password } = createCompanyOwnerDto;

    const hashedPassword = await this.hashData(password);

    const newUser = this.userRepository.create({
      firstName: createCompanyOwnerDto.firstName,
      lastName: createCompanyOwnerDto.lastName,
      password: hashedPassword,
      email: email.toLowerCase(),
      gender: createCompanyOwnerDto.gender,
      role: Role.UNASSIGNED,
    });

    const savedUser = await this.userRepository.save(newUser);

    return savedUser;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    const hashedToken = this.hashRefreshToken(refreshToken);

    return this.userRepository.findOne({
      where: {
        refreshToken: hashedToken,
      }
    })
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, {
      updatedAt: new Date(),
    })
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    const updateData: Partial<User> = {
      refreshToken: refreshToken ? this.hashRefreshToken(refreshToken) : null,
      refreshTokenExpiresAt: refreshToken ? this.getRefreshTokenExpiry() : null,
    };

    await this.userRepository.update(userId, updateData);
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const user = await this.findById(userId);

    if (!user.refreshToken || !user.refreshTokenExpiresAt) {
      return false;
    }

    if (new Date() > user.refreshTokenExpiresAt) {
      await this.updateRefreshToken(userId, null);
      return false;
    }

    const hashedToken = this.hashRefreshToken(refreshToken);
    return user.refreshToken === hashedToken;
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    await this.updateRefreshToken(userId, null);
  }

  private hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private getRefreshTokenExpiry(): Date {
    const expiryDays = 7;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + expiryDays);
    return expiry;
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

}
