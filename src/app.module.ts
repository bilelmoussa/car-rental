import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';


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
                        entities: [],
                        database: process.env.POSTGRES_DATABASE,
                        synchronize: false,
                        logging: true,
                }),
                AuthModule, UsersModule
        ],
        controllers: [AppController],
        providers: [AppService],
})
export class AppModule { }
