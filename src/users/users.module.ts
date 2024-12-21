import { INestApplication, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OpenAPIObject } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthGuard } from '@nestjs/passport';
import { AuthModule } from '../../src/auth/auth.module';



@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule],
})
export class UsersModule {
}
