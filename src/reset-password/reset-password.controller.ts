import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { sendResetPasswordEmail } from '../../middleware/mail';
import { PrismaClient, } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Controller('reset-password')

export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService, private readonly usersService: UsersService) { }

  @Post()
  async requestResetPassword(@Body('email') email: string): Promise<{ message: string }> {
    try {
      const token = this.resetPasswordService.generateResetToken(email);
      const user = await this.usersService.findUnique(email);
      if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      await sendResetPasswordEmail(email, token);
      return { message: 'votre email a été envoyé' };
    } catch (error) {
      console.log(error);
      throw new HttpException('Error sending reset password email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

