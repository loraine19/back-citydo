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
import * as jwt from 'jsonwebtoken';
import { ParseIntPipe } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    /// generate token
    async generateAccessToken(sub: number) {
        return this.jwtService.sign({ sub: sub }, { secret: process.env.JWT_SECRET, expiresIn: '45m' });
    }

    async generateRefreshToken(sub: number) {
        return this.jwtService.sign({ sub: sub }, { secret: process.env.JWT_SECRET, expiresIn: '15d' });
    }


    /// sign up
    async signUp(email: string, password: string): Promise<AuthEntity> {
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (user) throw new ConflictException(`user already exists for email: ${email}`);
        password = await argon2.hash(password);

        // add email activation

        const createdUser = await this.prisma.user.create({ data: { email, password } });
        const sub = createdUser.id
        return {
            accessToken: await this.generateAccessToken(sub),
            refreshToken: await this.generateRefreshToken(sub)
        }
    }

    /// sign in
    async signIn(email: string, password: string): Promise<AuthEntity> {
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (!user) throw new NotFoundException(`No user found for email: ${email}`);
        const isPasswordValid = await argon2.verify(user.password, password)

        if (!isPasswordValid) throw new UnauthorizedException('Invalid password')
        const sub = user.id
        return {
            accessToken: await this.generateAccessToken(sub),
            // accessToken: this.jwtService.sign({ sub: user.id }),
            refreshToken: await this.generateRefreshToken(user.id),
        }
    }


}