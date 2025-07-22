import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { B2BSignUpDto } from './signup.dto';

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
    return await this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: B2BSignUpDto) {
    const { email, password } = createUserDto;

    const hashedPassword = await this.hashData(password);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      email: email.toLowerCase(),
    });

    //await this.userRepository.save(newUser);

    return newUser;
  }

//
// async viewUser(id: number): Promise<User> {
//   const user = await this.userRepository.findOneBy({ id });
//   if (!user) {
//     throw new NotFoundException("User not found");
//   }
//   return user;
// }
}
