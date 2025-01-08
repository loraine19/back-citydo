import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { UsersService } from '../users/users.service';
import { sendResetPasswordEmail } from 'middleware/Mailer';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PrismaClient, User } from '@prisma/client';
import * as argon2 from 'argon2';

@Controller('reset-password')

export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService, private readonly usersService: UsersService, private jwtService: JwtService, private prisma: PrismaClient) { }

  @Post()
  async requestResetPassword(@Body('email') email: string): Promise<{ message: string }> {
    try {
      const token = this.resetPasswordService.generateResetToken(email);
      const user = await this.usersService.findUnique(email);
      if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      await sendResetPasswordEmail(email, token);
      await this.resetPasswordService.saveResetToken(email, token);
      return { message: 'votre email a été envoyé' };
    } catch (error) {
      console.log(error);
      throw new HttpException('Error sending reset password email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('update')
  @ApiBearerAuth()
  async updatePassword(@Body() data: { token: string, password: string, email: string }): Promise<User> {
    const { token, password, email } = data;
    const playload = this.jwtService.decode(token);
    if (playload.email !== email) throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    const user = await this.usersService.findUnique(email)
    const oldResetToken = await this.prisma.token.findFirst({ where: { userId: user.id, type: 'RESET' } })
    const isTokenMatch = await argon2.verify(oldResetToken.token, token);
    if (!isTokenMatch) throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    const isTokenValid = this.jwtService.verify(token);
    if (!isTokenValid) throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    const updatedUser = await this.usersService.update(user.id, { password });
    return updatedUser
  }
}

