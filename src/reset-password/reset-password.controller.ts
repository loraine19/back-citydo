import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { sendResetPasswordEmail } from '../../middleware/mail';
import * as jwt from 'jsonwebtoken';
import { generateResetToken } from 'middleware/resetToken';

@Controller('reset-password')
export class ResetPasswordController {

  @Post()
  async requestResetPassword(@Body('email') email: string): Promise<{ message: string }> {
    try {
      const token = generateResetToken(email);
      await sendResetPasswordEmail(email, token);
      return { message: 'Reset password link has been sent to your email' };
    } catch (error) {
      console.log(error);
      throw new HttpException('Error sending reset password email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

