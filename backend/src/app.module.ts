import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.entity';
import { CompanyModule } from './company/company.module';
import { Company } from './company/company.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      password: process.env.POSTGRES_PASSWORD,
      username: process.env.POSTGRES_USER,
      entities: [User, Company],
      database: process.env.POSTGRES_DATABASE,
      synchronize: true,
      logging: false,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    CompanyModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    }
  ],
})
export class AppModule { }
