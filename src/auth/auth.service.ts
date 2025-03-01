//src/auth/auth.service.ts
import { HttpException, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
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

    async generateRefreshToken(sub: number) { return this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET_REFRESH, expiresIn: process.env.JWT_EXPIRES_REFRESH }) }

    async generateVerifyToken(sub: number) { return this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_VERIFY }) }

    async setAuthCookies(res: Response, accessToken: string) {
        //ne pas stocker la resp ( browser / proxy / server)
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        //ne pas stocker la resp old browser
        res.setHeader('Pragma', 'no-cache');
        // deja expere ne pas mettre en cache 
        res.setHeader('Expires', '0');
        res.cookie('access', accessToken, {
            httpOnly: true,
            domain: process.env.DOMAIN,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: parseInt(process.env.COOKIE_EXPIRES_ACCESS),
            path: '/api',
        });
    }

    async signUp(data: SignInDto): Promise<{ message: string }> {
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
    async signIn(data: SignInDto, res: Response): Promise<{ refreshToken: string } | { message: string }> {
        let { email, password } = data
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (!user) { return { message: 'Utilisateur introuvable' } }
        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) return { message: 'mot de passe incorrect' }
        if (user.status === $Enums.UserStatus.INACTIVE) {
            this.mailerService.sendVerificationEmail(email, await this.generateVerifyToken(user.id));
            return { message: 'Votre compte est inactif, veuillez verifier votre email' }
        }
        const refreshToken = await this.generateRefreshToken(user.id);
        const accessToken = await this.generateAccessToken(user.id);
        await this.prisma.token.deleteMany({ where: { userId: user.id } })
        await this.prisma.token.create({ data: { userId: user.id, token: await argon2.hash(refreshToken), type: $Enums.TokenType.REFRESH } })
        this.setAuthCookies(res, accessToken);
        return { refreshToken }
    }

    //// SIGN IN VERIFY
    async signInVerify(data: SignInDto & { verifyToken: string }, res: Response): Promise<{ refreshToken: string }> {
        let { email, password, verifyToken } = data
        const user = await this.prisma.user.findUniqueOrThrow({ where: { email: email } });
        !user && new HttpException('Utilisateur introuvable', 404)
        const userToken = await this.prisma.token.findFirst({ where: { userId: user.id, type: $Enums.TokenType.VERIFY } })
        if (!userToken) throw new HttpException('Erreur de verification', 404)
        const refreshTokenValid = await argon2.verify(userToken.token, verifyToken)
        if (!refreshTokenValid) throw new HttpException('Probleme de verification' + userToken.createdAt, 401)
        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) throw new HttpException('Invalid password', 401)
        const accessToken = await this.generateAccessToken(user.id);
        const refreshToken = await this.generateRefreshToken(user.id);
        await this.prisma.user.update({ where: { id: user.id }, data: { status: $Enums.UserStatus.ACTIVE } })
        await this.prisma.token.deleteMany({ where: { userId: user.id, type: $Enums.TokenType.REFRESH } })
        await this.prisma.token.create({ data: { userId: user.id, token: await argon2.hash(refreshToken), type: $Enums.TokenType.REFRESH } })
        this.setAuthCookies(res, accessToken);
        return { refreshToken }
    }


    async refresh(refreshToken: string, userId: number, res: Response): Promise<{ refreshToken: string } | { message: string }> {
        // Use PrismaClientTransaction to avoid errror in case of multi entrance in the same time
        return await this.prisma.$transaction(async (prisma) => {
            try {
                const userToken = await prisma.token.findFirst({ where: { userId: userId, type: $Enums.TokenType.REFRESH } });
                if (!userToken) throw new HttpException('Impossible de renouveller la connexion , identifiez vous ', 403);
                const refreshTokenValid = await argon2.verify(userToken.token, refreshToken.trim());
                if (!refreshTokenValid) throw new HttpException('connexion interrompue, re-identifiez vous ', 403);
                await prisma.token.deleteMany({ where: { userId, type: $Enums.TokenType.REFRESH } });
                const accessToken = await this.generateAccessToken(userId);
                const newRefreshToken = await this.generateRefreshToken(userId);
                const newRefreshTokenHash = await argon2.hash(newRefreshToken);
                await prisma.token.create({
                    data: { userId, token: newRefreshTokenHash, type: $Enums.TokenType.REFRESH }
                });
                await this.setAuthCookies(res, accessToken)
                return { refreshToken: newRefreshToken };
            } catch (error) {
                console.error('Erreur lors du refresh du token :', error);
                throw new HttpException(error.message, 401);
            }
        });
    }

    async logOut(userId: number, res: Response): Promise<{ message: string }> {
        await this.prisma.token.deleteMany({ where: { userId, type: $Enums.TokenType.REFRESH } });
        res.clearCookie('access');
        return { message: 'Vous etes deconnecté' }
    }

    async deletAccount(userId: number): Promise<{ message: string }> {
        const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
        const deleteToken = await this.generateVerifyToken(user.id);
        const deleteTokenHash = await argon2.hash(deleteToken);
        const userToken = await this.prisma.token.findFirst({ where: { userId: userId, type: $Enums.TokenType.DELETE } });
        userToken && await this.prisma.token.delete({ where: { userId_type: { userId: userId, type: $Enums.TokenType.DELETE } } });
        await this.prisma.token.create({ data: { userId: user.id, token: deleteTokenHash, type: $Enums.TokenType.DELETE } })
        this.mailerService.sendDeleteAccountEmail(user.email, deleteToken);
        return { message: 'Un email avec le lien de suppression vous a été envoyé' }
    }

    async deletAccountConfirm(userId: number, email: string, deleteToken: string): Promise<{ message: string }> {
        const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
        if (user.email !== email) throw new HttpException('Vous n\'avez pas le droit de supprimer ce compte', 403);
        const userToken = await this.prisma.token.findFirst({ where: { userId: userId, type: $Enums.TokenType.DELETE } });
        const deleteTokenValid = await argon2.verify(userToken.token, deleteToken.trim());
        if (!deleteTokenValid) throw new HttpException('Vous n\'avez pas le droit de supprimer ce compte', 403);
        await this.prisma.user.delete({ where: { id: userId } });
        return { message: 'Votre compte a bien été supprimé' }
    }


}