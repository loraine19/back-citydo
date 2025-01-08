import { Module } from '@nestjs/common';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';
import { UsersService } from '../users/users.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService, UsersService, PrismaClient]
})
export class ResetPasswordModule { }
