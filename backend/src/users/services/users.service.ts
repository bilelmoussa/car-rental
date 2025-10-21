import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInput } from '../types/user.type';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { isEmail, isUUID } from 'class-validator';
import { UserUpdate } from '../types/user-update.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  hashData(data: string) {
    return bcrypt.hash(data, 12);
  }

  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  async update(userId: string, updateData: UserUpdate): Promise<User> {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid UUID');
    }

    const res = await this.userRepository.update(userId, updateData);

    if (res.affected === 0) {
      throw new BadRequestException('User not found!');
    }

    return await this.findById(userId);
  }

  async findPasswordByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !isEmail(normalizedEmail)) {
      throw new BadRequestException('Invalid email format');
    }

    return await this.userRepository.findOne({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      }
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !isEmail(normalizedEmail)) {
      throw new BadRequestException('Invalid email format');
    }

    return await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });
  }

  async createUser(dto: UserInput): Promise<User> {
    try {
      const { email, password } = dto;

      const hashedPassword = await this.hashData(password);

      const newUser = this.userRepository.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: hashedPassword,
        email: email.toLowerCase().trim(),
        gender: dto.gender,
        role: dto.role,
        emailVerified: false,
        isActive: true,
      });

      const savedUser = await this.userRepository.save(newUser);

      return savedUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Database error occurred');
    }
  }

  async findById(id: string): Promise<User> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        refreshToken: refreshToken,
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

  async findRefreshTokenExpireAt(userId: string): Promise<Date | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        refreshTokenExpiresAt: true,
      }
    });

    return user?.refreshTokenExpiresAt ?? null;
  }

}
