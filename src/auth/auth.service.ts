//src/auth/auth.service.ts
import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './auth.entities/auth.entity';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async signup(email: string, password: string): Promise<AuthEntity> {
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (user) throw new ConflictException(`user already exists for email: ${email}`);
        password = await argon2.hash(password);
        // add email activation
        const createdUser = await this.prisma.user.create({ data: { email, password } });
        return { accessToken: this.jwtService.sign({ userId: createdUser.id }) }
    }


    async login(email: string, password: string): Promise<AuthEntity> {
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (!user) throw new NotFoundException(`No user found for email: ${email}`);
        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) throw new UnauthorizedException('Invalid password')
        console.log('user')
        return {
            accessToken: this.jwtService.sign({ userId: user.id }),
        }
    }


}