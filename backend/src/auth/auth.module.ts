import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, CompanyModule],
})
export class AuthModule { }
