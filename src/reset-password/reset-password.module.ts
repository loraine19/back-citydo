import { Module } from '@nestjs/common';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';
import { UsersService } from '../users/users.service';
import { PrismaClient } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService, UsersService, PrismaClient, MailerService]
})
export class ResetPasswordModule { }
