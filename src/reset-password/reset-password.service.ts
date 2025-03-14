import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums, Token } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';


@Injectable()
export class ResetPasswordService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private mailerService: MailerService) { }
  generateResetToken = (email: string): string => {
    const payload = { email };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '1h' };
    return jwt.sign(payload, secret, options);
  };

  saveResetToken = async (email: string, token: string): Promise<Token> => {
    const user = await this.prisma.user.findUnique({ where: { email } });
    const userId = user.id;
    const type = $Enums.TokenType.RESET
    await this.prisma.token.deleteMany({ where: { userId, type } });
    const hashedToken = await argon2.hash(token);
    const resetToken = await this.prisma.token.create({ data: { userId, token: hashedToken, type } });
    return resetToken
  }

  async validate(payload: { email: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) { throw new UnauthorizedException("no User"); }
    return user;
  }

  async requestResetPassword(email: string): Promise<{ message: string }> {
    try {
      const token = this.generateResetToken(email);
      const user = await this.prisma.user.findUniqueOrThrow({ where: { email: email } })
      if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      await this.mailerService.sendResetPasswordEmail(email, token);
      await this.saveResetToken(email, token);
      return { message: 'votre email de reinitialisation été envoyé' };
    } catch (error) {
      throw new HttpException('Error sending reset password email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePassword(data: any): Promise<{ message: string }> {
    const { resetToken, password, email } = data;
    const playload = this.jwtService.decode(resetToken);
    if (playload.email !== email) throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    const user = await this.prisma.user.findUniqueOrThrow({ where: { email: email } })
    const oldResetToken = await this.prisma.token.findFirst({ where: { userId: user.id, type: 'RESET' } })
    const isTokenMatch = await argon2.verify(oldResetToken.token, resetToken);
    if (!isTokenMatch) throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    const isTokenValid = this.jwtService.verify(resetToken);
    if (!isTokenValid) throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    const updatedUser = await this.prisma.user.update({ where: { id: user.id }, data: { password: await argon2.hash(password) } });
    if (!updatedUser) throw new HttpException('Error updating password', HttpStatus.INTERNAL_SERVER_ERROR);
    return { message: 'Mot de passe mis à jour, vous pouvez vous connecter' };
  }
}