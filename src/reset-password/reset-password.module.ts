import { Module } from '@nestjs/common';
import { ResetPasswordController } from './reset-password.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ResetPasswordService } from './reset-password.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService, UsersService]
})
export class ResetPasswordModule { }
