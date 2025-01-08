//src/auth/auth.service.ts
import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity, RefreshEntity } from './auth.entities/auth.entity';
import * as argon2 from 'argon2';
import { SignInDto } from './dto/signIn.dto';
import { $Enums } from '@prisma/client';
import { sendVerificationEmail } from 'middleware/Mailer';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async generateAccessToken(sub: number) { return this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_ACCESS }) }

    async generateRefreshToken(sub: number) { return this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_REFRESH }) }

    async generateVerifyToken(sub: number) { return this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_VERIFY }) }

    async signUp(data: SignInDto): Promise<AuthEntity | { message: string }> {
        let { email, password } = data
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (user) throw new ConflictException(`user already exists for email: ${email}`);
        password = await argon2.hash(password);
        const createdUser = await this.prisma.user.create({ data: { email, password } });
        const verifyToken = await this.generateRefreshToken(createdUser.id);
        await this.prisma.token.create({ data: { userId: createdUser.id, token: await argon2.hash(verifyToken), type: $Enums.TokenType.VERIFY } })
        sendVerificationEmail(email, verifyToken)
        return {
            message: 'User created, verification email sent'
        }
    }

    //  sign_in
    async signIn(data: SignInDto): Promise<AuthEntity | { message: string }> {
        let { email, password } = data
        const user = await this.prisma.user.findUniqueOrThrow({ where: { email: email } });
        if (!user) { throw new HttpException('User not found', 404) }

        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) { throw new HttpException('Invalid password', 401) }
        if (user.status === $Enums.UserStatus.INACTIVE) {
            sendVerificationEmail(email, await this.generateVerifyToken(user.id));
            return { message: 'User not verified, verification email sent' }
        }
        else if (user.status === $Enums.UserStatus.ACTIVE) {
            const refreshToken = await this.generateRefreshToken(user.id);
            await this.prisma.token.deleteMany({ where: { userId: user.id, type: $Enums.TokenType.REFRESH } })
            await this.prisma.token.create({ data: { userId: user.id, token: await argon2.hash(refreshToken), type: $Enums.TokenType.REFRESH } })
            return {
                accessToken: await this.generateAccessToken(user.id),
                refreshToken
            }
        }
    }

    async signInVerify(data: SignInDto & { verifyToken: string }): Promise<AuthEntity> {
        let { email, password, verifyToken } = data
        const user = await this.prisma.user.findUniqueOrThrow({ where: { email: email } });
        !user && new HttpException('User not found', 404)
        const userToken = await this.prisma.token.findFirst({ where: { userId: user.id, type: $Enums.TokenType.VERIFY } })
        if (!userToken) throw new UnauthorizedException('Invalid User')
        const refreshTokenValid = await argon2.verify(userToken.token, verifyToken)
        if (!refreshTokenValid) throw new UnauthorizedException('Tokens dont match ' + userToken.createdAt)
        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) throw new UnauthorizedException('Invalid password')
        const refreshToken = await this.generateRefreshToken(user.id);
        await this.prisma.user.update({ where: { id: user.id }, data: { status: $Enums.UserStatus.ACTIVE } })
        await this.prisma.token.deleteMany({ where: { userId: user.id, type: $Enums.TokenType.REFRESH } })
        await this.prisma.token.create({ data: { userId: user.id, token: await argon2.hash(refreshToken), type: $Enums.TokenType.REFRESH } })
        return {
            accessToken: await this.generateAccessToken(user.id),
            refreshToken
        }
    }


    /// RERESH TOKEN
    async refresh(refreshToken: string, userId: number): Promise<AuthEntity> {
        if (!refreshToken) throw new UnauthorizedException('no refresh token')
        const userToken = await this.prisma.token.findFirst({ where: { userId: userId, type: $Enums.TokenType.REFRESH } })
        if (!userToken) throw new UnauthorizedException('Invalid User')
        const refreshTokenValid = await argon2.verify(userToken.token, refreshToken)
        if (!refreshTokenValid) throw new UnauthorizedException('Tokens dont match ' + userToken.createdAt)
        const newRefreshToken = await this.generateRefreshToken(userId);
        await this.prisma.token.deleteMany({ where: { userId, type: $Enums.TokenType.REFRESH } })
        await this.prisma.token.create({ data: { userId, token: await argon2.hash(newRefreshToken), type: $Enums.TokenType.REFRESH } })
        return {
            accessToken: await this.generateAccessToken(userId),
            refreshToken: newRefreshToken
        }
    }


}