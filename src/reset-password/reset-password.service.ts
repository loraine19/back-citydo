import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums, Token } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class ResetPasswordService {
  constructor(private prisma: PrismaService, private userService: UsersService) { }
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
    const user = await this.userService.findUnique(payload.email);
    if (!user) { throw new UnauthorizedException("no User"); }
    return user;
  }
}