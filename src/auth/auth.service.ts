//src/auth/auth.service.ts
import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity, RefreshEntity } from './auth.entities/auth.entity';
import * as argon2 from 'argon2';
import { SignInDto } from './dto/signIn.dto';
import { $Enums } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, private mailerService: MailerService) { }

    async generateAccessToken(sub: number) { return this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_ACCESS }) }

    async generateRefreshToken(sub: number) { return this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_REFRESH }) }

    async generateVerifyToken(sub: number) { return this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_VERIFY }) }

    async signUp(data: SignInDto): Promise<AuthEntity | { message: string }> {
        let { email, password } = data
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (user) return { message: 'Vous avez déjà un compte' };
        password = await argon2.hash(password);
        const createdUser = await this.prisma.user.create({ data: { email, password } });
        const verifyToken = await this.generateRefreshToken(createdUser.id);
        await this.prisma.token.create({ data: { userId: createdUser.id, token: await argon2.hash(verifyToken), type: $Enums.TokenType.VERIFY } })
        this.mailerService.sendVerificationEmail(email, verifyToken)
        return { message: 'Votre compte à bien été crée, veuillez vérifier votre email' }
    }

    //// SIGN IN
    async signIn(data: SignInDto): Promise<AuthEntity | { message: string }> {
        let { email, password } = data
        const user = await this.prisma.user.findUniqueOrThrow({ where: { email: email } });
        if (!user) { throw new HttpException('User not found', 404) }
        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) return { message: 'mot de passe incorrect' }
        if (user.status === $Enums.UserStatus.INACTIVE) {
            this.mailerService.sendVerificationEmail(email, await this.generateVerifyToken(user.id));
            return { message: 'Votre compte est inactif, veuillez verifier votre email' }
        }
        const refreshToken = await this.generateRefreshToken(user.id);
        await this.prisma.token.deleteMany({ where: { userId: user.id } })
        await this.prisma.token.create({ data: { userId: user.id, token: await argon2.hash(refreshToken), type: $Enums.TokenType.REFRESH } })
        return {
            accessToken: await this.generateAccessToken(user.id),
            refreshToken

        }
    }

    //// SIGN IN VERIFY
    async signInVerify(data: SignInDto & { verifyToken: string }): Promise<AuthEntity> {
        let { email, password, verifyToken } = data
        const user = await this.prisma.user.findUniqueOrThrow({ where: { email: email } });
        !user && new HttpException('User not found', 404)
        const userToken = await this.prisma.token.findFirst({ where: { userId: user.id, type: $Enums.TokenType.VERIFY } })
        if (!userToken) throw new HttpException('User have no verify token', 404)
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
    async refresh(refreshToken: string, userId: number): Promise<AuthEntity | { message: string }> {
        if (!refreshToken) throw new UnauthorizedException('no refresh token')
        const userToken = await this.prisma.token.findFirst({ where: { userId: userId, type: $Enums.TokenType.REFRESH } })
        if (!userToken) return { message: 'utilisateur non enregistré' }
        const decode = this.jwtService.decode(refreshToken)
        const refreshTokenValid = await argon2.verify(userToken.token, refreshToken)
        if (!refreshTokenValid) throw new UnauthorizedException('crypt dont match')
        const newRefreshToken = await this.generateRefreshToken(userId);
        const deleted = await this.prisma.token.deleteMany({ where: { userId, type: $Enums.TokenType.REFRESH } })
        deleted && await this.prisma.token.create({ data: { userId, token: await argon2.hash(newRefreshToken), type: $Enums.TokenType.REFRESH } })
        return {
            accessToken: await this.generateAccessToken(userId),
            refreshToken: newRefreshToken
        }
    }


}