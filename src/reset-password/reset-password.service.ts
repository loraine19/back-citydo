import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ResetPasswordService {

  generateResetToken = (email: string): string => {
    const payload = { email };
    const secret = 'secret';
    const options = { expiresIn: '1h' };
    return jwt.sign(payload, secret, options);
  };
}