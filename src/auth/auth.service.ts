//src/auth/auth.service.ts
import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './auth.entities/auth.entity';
import * as argon2 from 'argon2';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    /// generate token
    async generateAccessToken(sub: number) { return this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET, expiresIn: '45m' }) }

    async generateRefreshToken(sub: number) { return this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET, expiresIn: '15d' }) }


    /// sign up
    async signUp(data: SignInDto): Promise<AuthEntity> {
        let { email, password } = data
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (user) throw new ConflictException(`user already exists for email: ${email}`);
        password = await argon2.hash(password);
        // add email activation
        const createdUser = await this.prisma.user.create({ data: { email, password } });
        return {
            accessToken: await this.generateAccessToken(createdUser.id),
            refreshToken: await this.generateRefreshToken(createdUser.id)
        }
    }

    //  sign in
    async signIn(data: SignInDto): Promise<AuthEntity> {
        let { email, password } = data
        const user = await this.prisma.user.findUniqueOrThrow({ where: { email: email } });
        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) throw new UnauthorizedException('Invalid password')
        const refreshToken = await this.generateRefreshToken(user.id);
        await this.prisma.token.deleteMany({ where: { userId: user.id, type: 'REFRESH' } })
        await this.prisma.token.create({ data: { userId: user.id, token: await argon2.hash(refreshToken), type: 'REFRESH' } })
        return {
            accessToken: await this.generateAccessToken(user.id),
            refreshToken
        }
    }

    /// RERESH TOKEN
    async refresh(refreshToken: string, userId: number): Promise<any> {
        const userToken = await this.prisma.token.findFirst({ where: { userId: userId, type: 'REFRESH' } })
        const refreshTokenValid = await argon2.verify(userToken.token, refreshToken)
        if (!refreshTokenValid) throw new UnauthorizedException('Invalid refresh token')
        const newRefreshToken = await this.generateRefreshToken(userId);
        await this.prisma.token.deleteMany({ where: { userId, type: 'REFRESH' } })
        await this.prisma.token.create({ data: { userId, token: await argon2.hash(refreshToken), type: 'REFRESH' } })
        return {
            accessToken: await this.generateAccessToken(userId),
            refreshToken: newRefreshToken
        }
    }


}