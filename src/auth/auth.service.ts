import { HttpException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { SignInDto } from './dto/signIn.dto';
import { $Enums, User } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';
import { AuthUser } from './dto/authUser.dto';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, private mailerService: MailerService) { }

    private memoryOptions = {
        memoryCost: 1 * 64 * 16, // 64 mebibytes
        timeCost: 2,
        parallelism: 1
    }

    async generateAccessToken(sub: number) {
        return this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_ACCESS })
    }

    async generateRefreshToken(sub: number): Promise<{ refreshToken: string, hashRefreshToken: string }> {
        const refreshToken = this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET_REFRESH, expiresIn: process.env.JWT_EXPIRES_REFRESH })
        const hashRefreshToken = await argon2.hash(refreshToken, this.memoryOptions);
        return { refreshToken, hashRefreshToken }
    }

    async generateVerifyToken(sub: number) {
        const token = this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_VERIFY })
        const hashToken = await argon2.hash(token, this.memoryOptions);
        return { token, hashToken }

    }

    errorCredentials = { message: 'Identifiants incorrect' }


    async setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.cookie(process.env.ACCESS_COOKIE_NAME, accessToken, {
            httpOnly: true,
            domain: process.env.DOMAIN,
            secure: true,
            // sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
            maxAge: parseInt(process.env.COOKIE_EXPIRES_ACCESS),
            //path: '/',
        });
        res.cookie(process.env.REFRESH_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            domain: process.env.DOMAIN,
            secure: true,
            //  sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
            maxAge: parseInt(process.env.COOKIE_EXPIRES_REFRESH),
            //  path: '/',
        });

        console.log('Headers après définition du cookie:', res.getHeaders());
    }

    includeConfigUser = { Profile: { include: { Address: true } }, GroupUser: true }
    async signUp(data: SignInDto): Promise<{ message: string }> {
        const { email, password } = data
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (user) return { message: 'Vous avez déjà un compte' };
        const hashPassword = await argon2.hash(password.trim(), this.memoryOptions);
        const createdUser = await this.prisma.user.create({ data: { email, password: hashPassword } });
        const verifyToken = await this.generateVerifyToken(createdUser.id);
        await this.prisma.token.create({
            data: { userId: createdUser.id, token: verifyToken.hashToken, type: $Enums.TokenType.VERIFY }
        })
        this.mailerService.sendVerificationEmail(email, verifyToken.token)
        return { message: 'Votre compte à bien été crée, veuillez cliquer sur le lien envoyé par email' }
    }

    //// SIGN IN
    async signIn(data: SignInDto, res: Response): Promise<{ user: Partial<User> } | { message: string }> {
        const { email, password } = data
        console.log('Data:', data);
        const user = await this.prisma.user.findUnique({ where: { email }, include: this.includeConfigUser });
        if (!user) return this.errorCredentials
        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) return this.errorCredentials
        if (user.status === $Enums.UserStatus.INACTIVE) {
            const newVerifyToken = await this.generateVerifyToken(user.id);
            this.mailerService.sendVerificationEmail(email, newVerifyToken.token);
            await this.prisma.token.update({ where: { userId_type: { userId: user.id, type: $Enums.TokenType.VERIFY } }, data: { token: newVerifyToken.hashToken } })
            return { message: 'Votre compte est inactif, veuillez verifier votre email' }
        }
        const { refreshToken, hashRefreshToken } = await this.generateRefreshToken(user.id);
        const accessToken = await this.generateAccessToken(user.id);
        await this.prisma.token.deleteMany({ where: { userId: user.id, type: $Enums.TokenType.REFRESH } });
        await this.prisma.token.create({ data: { userId: user.id, token: hashRefreshToken, type: $Enums.TokenType.REFRESH } });
        this.setAuthCookies(res, accessToken, refreshToken);
        user.password = ''
        return { user }
    }

    //// SIGN IN VERIFY
    async signInVerify(data: SignInDto & { verifyToken: string }, res: Response): Promise<{ user: Partial<User> } | { message: string }> {
        const { email, password, verifyToken } = data
        const user = await this.prisma.user.findUniqueOrThrow({ where: { email: email }, include: this.includeConfigUser });
        if (!user) return this.errorCredentials
        const userToken = await this.prisma.token.findFirst({ where: { userId: user.id, type: $Enums.TokenType.VERIFY } })
        if (!userToken) return this.errorCredentials
        const refreshTokenValid = await argon2.verify(userToken.token, verifyToken)
        if (!refreshTokenValid) return this.errorCredentials
        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) return this.errorCredentials
        const accessToken = await this.generateAccessToken(user.id);
        const { refreshToken, hashRefreshToken } = await this.generateRefreshToken(user.id);
        await this.prisma.user.update({ where: { id: user.id }, data: { status: $Enums.UserStatus.ACTIVE } })
        await this.prisma.token.deleteMany({ where: { userId: user.id, type: $Enums.TokenType.REFRESH } })
        await this.prisma.token.create({ data: { userId: user.id, token: hashRefreshToken, type: $Enums.TokenType.REFRESH } })
        this.setAuthCookies(res, accessToken, refreshToken);
        user.password = ''
        return { user }
    }


    async refresh(refreshToken: string, userId: number, res: Response): Promise<{ message: string }> {
        const userToken = await this.prisma.token.findFirst({ where: { userId, type: $Enums.TokenType.REFRESH } });
        if (!userToken) throw new HttpException('Impossible de renouveller la connexion , identifiez vous ', 403);
        let refreshTokenValid = await argon2.verify(userToken.token, refreshToken);
        if (!refreshTokenValid) {
            const jwtCreated = new Date(this.jwtService.decode(refreshToken)?.iat * 1000).toLocaleTimeString();
            const refreshUpdated = new Date(userToken.updatedAt).toLocaleTimeString();
            console.log('JWTfront register:', jwtCreated, 'Refresh token:', refreshUpdated);
            throw new HttpException(`Impossible de renouveller la connexion, JWT created at:', ${jwtCreated}, 'Refresh token:', ${refreshUpdated}, identifiez vous `, 403);
        }
        const accessToken = await this.generateAccessToken(userId);
        const newRefresh = await this.generateRefreshToken(userId);
        const updateRefreshToken = await this.prisma.token.update({
            where: { userId_type: { userId, type: $Enums.TokenType.REFRESH } },
            data: { userId, token: newRefresh.hashRefreshToken }
        });
        if (!updateRefreshToken) throw new HttpException('probleme de mise a jour du token', 500)
        await this.setAuthCookies(res, accessToken, newRefresh.refreshToken);
        return { message: 'Token rafraichi' }
    }


    async logOut(userId: number, res: Response): Promise<{ message: string }> {
        await this.prisma.token.deleteMany({ where: { userId, type: $Enums.TokenType.REFRESH } });
        res.clearCookie(process.env.ACCESS_COOKIE_NAME);
        res.clearCookie(process.env.REFRESH_COOKIE_NAME);
        return { message: 'Vous etes deconnecté' }
    }

    async deletAccount(userId: number): Promise<{ message: string }> {
        const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
        const deleteToken = await this.generateVerifyToken(user.id);
        const userToken = await this.prisma.token.findFirst({ where: { userId: userId, type: $Enums.TokenType.DELETE } });
        userToken && await this.prisma.token.delete({ where: { userId_type: { userId: userId, type: $Enums.TokenType.DELETE } } });
        await this.prisma.token.create({ data: { userId: user.id, token: deleteToken.hashToken, type: $Enums.TokenType.DELETE } })
        this.mailerService.sendDeleteAccountEmail(user.email, deleteToken.token);
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

    async deleteTester() {
        if (process.env.NODE_ENV === 'dev') { await this.prisma.user.deleteMany({ where: { email: 'testeur_cityzen@imagindev.com' } }) }
        return { message: 'Les utilisateurs de test ont été supprimés' }
    }

    async validateUser(email: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email }, include: this.includeConfigUser });
        if (!user) return null;
        return user;

    }

    async googleAuth(authUser: AuthUser) {
        const { email, ...profile } = authUser
        const user = await this.prisma.user.findUnique({ where: { email }, include: this.includeConfigUser });
        const newUser = await this.prisma.user.create({ data: { email, password: '' } });
        const { refreshToken, hashRefreshToken } = await this.generateRefreshToken(newUser.id);
        const accessToken = await this.generateAccessToken(newUser.id);



    }

    async googleSignIn() { }
    async googleSignUp() { }


}

