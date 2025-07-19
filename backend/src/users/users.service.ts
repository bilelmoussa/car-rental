import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user-dto';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  createUser(createUserdDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.fullName = createUserdDto.fullName;
    user.email = createUserdDto.email;
    user.password = createUserdDto.password;
    return this.userRepository.save(user);
  }

  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
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
