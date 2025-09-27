import { UsersService } from "src/users/services/users.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Role } from "src/users/enums/Role";
import { Gender } from "src/users/enums/Gender";
import { UpdateUserDto } from "src/users/dtos/update-user.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { UserInput } from "src/users/types/user.type";

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UserService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 'b7b1d9c8-1234-4567-890a-bcdef1234567',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    gender: Gender.MALE,
    role: Role.CUSTOMER,
    password: 'hashedPassword123',
    refreshToken: null,
    refreshTokenExpiresAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    emailVerified: false,
  };

  const mockUserDto: UserInput = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    gender: Gender.MALE,
    password: 'Password123',
    role: Role.COMPANYOWNER,
  }

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User)) as jest.Mocked<Repository<User>>;

    jest.clearAllMocks();
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hashData', () => {
    it('should return data with bcrypt', async () => {
      const plainPassword = 'testPassword123';
      const hashedPassword = 'hashedTestPassword123';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never)

      const result = await service.hashData(plainPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 12);
      expect(result).toBe(hashedPassword);
    })
  });

  describe('findAllUser', () => {
    it('should return an array of users', async () => {
      const expectedUsers = [mockUser];
      repository.find.mockResolvedValue(expectedUsers);

      const result = await service.findAllUser();

      expect(repository.find).toHaveBeenCalledWith();
      expect(result).toEqual(expectedUsers);
    })
  });

  describe('update', () => {
    it('should update user successfully and return updated user', async () => {
      const userId: string = '550e8400-e29b-41d4-a716-446655440000';
      const updateData: UpdateUserDto = { firstName: 'UpdatedName' };
      const updatedUser: User = {
        ...mockUser,
        id: userId,
        firstName: 'UpdatedName'
      };

      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateData);

      expect(repository.update).toHaveBeenCalledWith(userId, updateData);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toEqual(updatedUser);
    });

    it('should throw BadRequestException when userId is invalid', async () => {
      const userId = 'invalidUserId';
      const updateData: UpdateUserDto = { firstName: 'UpdatedName' };

      await expect(service.update(userId, updateData))
        .rejects
        .toThrow('Invalid UUID');
    })

    it('should return error object when user not found (affected = 0)', async () => {
      const userId: string = '550e8400-e29b-41d4-a716-446655440000';
      const updateData: UpdateUserDto = { firstName: "UpdatedName" };

      repository.update.mockResolvedValue({ affected: 0 } as any);

      await expect(service.update(userId, updateData))
        .rejects
        .toThrow('User not found!');

      expect(repository.update).toHaveBeenCalledWith(userId, updateData);
      expect(repository.findOne).not.toHaveBeenCalled();
    })
  });

  describe('findPasswordByEmail', () => {
    it('should return user with password when found by email', async () => {
      const email = 'john.doe@example.com';
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findPasswordByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
        }
      });
      expect(result).toEqual(mockUser)
    })

    it('should return null when user not found', async () => {
      const email = 'notfound@exmaple.com';
      repository.findOne.mockResolvedValue(null);

      const result = await service.findPasswordByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
        }
      });
      expect(result).toBeNull();
    })

    it('should throw BadRequestException: Invalid email format when email is not valid', async () => {
      const email = 'invalidEmail';

      expect(service.findPasswordByEmail(email))
        .rejects
        .toThrow('Invalid email format');
    })

    it('it should find a user regardless of email case and even with extra spaces', async () => {
      const email = ' JoHn.DOE@example.com ';
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findPasswordByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
        }
      });
      expect(result).toEqual(mockUser);
    })
  })

  describe('findUserByEmail', () => {
    it('should return user when find by email', async () => {
      const email = 'john.doe@example.com';
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(mockUser);
    })

    it('should return null when user not found', async () => {
      const email = "notfoundemail@gmail.com";
      repository.findOne.mockResolvedValue(null);

      const result = await service.findUserByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toBeNull();
    })

    it('should throw BadRequestException: Invalid email format when email is not valid', async () => {
      const email = 'invalidEmail';

      expect(service.findUserByEmail(email))
        .rejects
        .toThrow('Invalid email format');
    })

    it('should find a user regardless of email case and even with extra spaces', async () => {
      const email = ' JoHn.DOE@example.com ';
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
      });
      expect(result).toEqual(mockUser);
    })
  })

  describe('createUser', () => {
    it('should create and save a new user successfully', async () => {
      const hashedPassword = 'hashedPlainPassword123';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const createUser = {
        ...mockUserDto,
        email: mockUserDto.email.toLowerCase(),
        password: hashedPassword
      };

      repository.create.mockReturnValue(createUser as User);
      repository.save.mockResolvedValue({ ...createUser, id: 'b7b1d9c8-1234-4567-890a-bcdef1234567' } as User);

      const result = await service.createUser(mockUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserDto.password, 12);
      expect(repository.create).toHaveBeenCalledWith({
        firstName: mockUserDto.firstName,
        lastName: mockUserDto.lastName,
        email: mockUserDto.email.toLowerCase(),
        gender: mockUserDto.gender,
        password: hashedPassword,
        role: mockUserDto.role,
      });
      expect(repository.save).toHaveBeenCalledWith(createUser);
      expect(result).toEqual({ ...createUser, id: 'b7b1d9c8-1234-4567-890a-bcdef1234567' });
    })

    it('should create and save a user regardless of email case or extra spaces', async () => {
      const email = "  JOhn.doe@example.com  ";
      const createUser = {
        ...mockUserDto,
        email: email,
      };

      const hashedPassword = 'hashedPlainPassword123';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const createdUser = { ...createUser, email: email.toLowerCase().trim(), password: hashedPassword };

      repository.create.mockReturnValue(createdUser as User);
      repository.save.mockResolvedValue({ ...createdUser, id: 'b7b1d9c8-1234-4567-890a-bcdef1234567' } as User);

      const result = await service.createUser(createUser);

      expect(result.email).toBe(email.toLowerCase().trim());
    })

    it('should throw ConflictException if email already exists', async () => {
      const dto = { ...mockUserDto };
      const hashedPassword = 'hashedPlainPassword123';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const createdUser = {
        ...dto,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
      };

      repository.create.mockReturnValue(createdUser as User);
      repository.save.mockRejectedValue({ code: '23505' });

      await expect(service.createUser(dto)).rejects.toThrow(ConflictException);
      expect(repository.create).toHaveBeenCalledWith(createdUser
      );
    })

    it('should throw db failure', async () => {
      const dto = { ...mockUserDto };
      const hashedPassword = 'hashedPlainPassword123';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const createdUser = {
        ...dto,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
      };

      const dbError = new Error('Unexpected DB failure') as any;
      dbError.code = '99999';

      repository.create.mockReturnValue(createdUser as User);
      repository.save.mockRejectedValue(dbError);

      await expect(service.createUser(dto)).rejects.toThrow(InternalServerErrorException);
      expect(repository.create).toHaveBeenCalledWith(createdUser
      );
    })
  })

  describe('findById', () => {
    it('should return user when find by id', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockUser);
    })

    it('should throw BadRequestException when userId is invalid', async () => {
      const id = 'InvalidId';
      expect(service.findById(id))
        .rejects
        .toThrow('Invalid UUID');
    })

    it('should throw BadRequestException when user not found', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440056';
      repository.findOne.mockResolvedValue(null);

      await expect(service.findById(id))
        .rejects
        .toThrow('User not found');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    })
  })
})
