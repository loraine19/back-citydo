import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { SignInDto } from './dto/signIn.dto';
import { $Enums, Profile, User, UserStatus, Prisma } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';
import { AuthUserGoogle } from './dto/authUserGoogle.dto';
import { SignUpDto } from './dto/signUp.dto';
import { DeviceInfo } from 'middleware/decorators';


@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name); // Pour le logging
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private mailerService: MailerService) { }

    private memoryOptions = {
        memoryCost: 1 * 64 * 16, // 64 mebibytes
        timeCost: 2,
        parallelism: 1
    }

    private expiredAt = (duration: string) => (new Date(Date.now() + parseInt(duration))).toISOString();

    async generateAccessToken(sub: number) {
        return this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_ACCESS } as any)
    }

    async generateRefreshToken(userId: number): Promise<{ refreshToken: string, hashRefreshToken: string }> {
        const refreshToken = this.jwtService.sign({ sub: userId }, { secret: process.env.JWT_SECRET_REFRESH, expiresIn: process.env.JWT_EXPIRES_REFRESH } as any)
        const hashRefreshToken = await argon2.hash(refreshToken, this.memoryOptions);
        return { refreshToken, hashRefreshToken }
    }

    async generateVerifyToken(sub: number) {
        const token = this.jwtService.sign({ sub }, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_VERIFY } as any)
        const hashToken = await argon2.hash(token, this.memoryOptions);
        return { token, hashToken }
    }

    errorCredentials = { message: 'Identifiants incorrect' }

    setAuthCookies(res: Response, accessToken: string, refreshToken: string, userId?: number) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.cookie(process.env.ACCESS_COOKIE_NAME, accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
            maxAge: parseInt(process.env.COOKIE_EXPIRES_ACCESS),
            path: '/',
        });
        res.cookie(process.env.REFRESH_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
            maxAge: parseInt(process.env.COOKIE_EXPIRES_REFRESH),
            path: '/',
        });
        res.cookie('userId', userId, {
            httpOnly: true,
            secure: true,
            sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
            maxAge: parseInt(process.env.COOKIE_EXPIRES_REFRESH),
            path: '/',
        });
        res.cookie('isLogged', 'true', {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            maxAge: parseInt(process.env.COOKIE_EXPIRES_REFRESH),
            path: '/',
            domain: process.env.DOMAIN
        })
        console.log('Headers après définition du cookie:', res.getHeaders());
    }

    setAuthCookiesLoggout(res: Response) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.cookie('isLogged', 'false', {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            maxAge: parseInt(process.env.COOKIE_EXPIRES_REFRESH),
            path: '/',
            domain: process.env.DOMAIN
        })
        console.log('Headers après définition du cookie:', res.getHeaders());
    }

    includeConfigUser = { Profile: { include: { Address: true } }, GroupUser: { include: { Group: true } } }

    /// SIGN UP
    async signUp(data: SignUpDto, deviceInfo: DeviceInfo, ip: string): Promise<{ message: string }> {
        const { email, password } = data
        const { deviceId, deviceName } = deviceInfo
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (user) return { message: 'Vous avez déjà un compte' };
        const hashPassword = await argon2.hash(password.trim(), this.memoryOptions);
        const createdUser = await this.prisma.user.create({ data: { email, password: hashPassword } });
        const verifyToken = await this.generateVerifyToken(createdUser.id);
        await this.prisma.token.create({
            data: {
                userId: createdUser.id,
                token: verifyToken.hashToken,
                type: $Enums.TokenType.VERIFY,
                ip,
                deviceId,
                deviceName,
                expiredAt: this.expiredAt('60000')
            },
        })
        this.mailerService.sendVerificationEmail(email, verifyToken.token)
        return { message: 'Votre compte à bien été crée, veuillez cliquer sur le lien envoyé par email' }
    }

    //// SIGN IN
    async signIn(data: SignInDto, res: Response, deviceInfo: DeviceInfo, ip: string): Promise<{ user: Partial<User> } | { message: string }> {
        const { email, password } = data
        const { deviceId, deviceName } = deviceInfo
        const user = await this.prisma.user.findUnique({ where: { email }, include: this.includeConfigUser });
        if (!user) return this.errorCredentials
        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) return this.errorCredentials
        if (user.status === $Enums.UserStatus.INACTIVE) {
            const newVerifyToken = await this.generateVerifyToken(user.id);
            this.mailerService.sendVerificationEmail(email, newVerifyToken.token);
            await this.prisma.token.update({ where: { userId_type_deviceId: { userId: user.id, type: $Enums.TokenType.VERIFY, deviceId } }, data: { token: newVerifyToken.hashToken } })
            this.setAuthCookiesLoggout(res);
            return { message: 'Votre compte est inactif, veuillez verifier votre email' }
        }
        const { refreshToken, hashRefreshToken } = await this.generateRefreshToken(user.id);
        await this.prisma.token.deleteMany({ where: { userId: user.id, deviceId } });
        const accessToken = await this.generateAccessToken(user.id);

        await this.prisma.token.create({
            data:
            {
                userId: user.id,
                token: hashRefreshToken,
                type: $Enums.TokenType.REFRESH,
                ip,
                deviceId,
                deviceName,
                expiredAt: this.expiredAt(process.env.COOKIE_EXPIRES_REFRESH)
            }
        });
        this.setAuthCookies(res, accessToken, refreshToken, user.id);
        user.password = ''
        return { user }
    }

    //// SIGN IN VERIFY
    async signInVerify(data: SignInDto & { verifyToken: string }, res: Response, deviceInfo: DeviceInfo, ip: string): Promise<{ user: Partial<User> } | { message: string }> {
        const { email, password, verifyToken } = data
        const { deviceId, deviceName } = deviceInfo
        const user = await this.prisma.user.findUniqueOrThrow({ where: { email: email }, include: this.includeConfigUser });
        if (!user) return this.errorCredentials
        const userToken = await this.prisma.token.findFirst({ where: { userId: user.id, type: $Enums.TokenType.VERIFY, deviceId } })
        if (!userToken) return this.errorCredentials
        const refreshTokenValid = await argon2.verify(userToken.token, verifyToken)
        if (!refreshTokenValid) return this.errorCredentials
        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) return this.errorCredentials
        const accessToken = await this.generateAccessToken(user.id);
        const { refreshToken, hashRefreshToken } = await this.generateRefreshToken(user.id);
        await this.prisma.user.update({ where: { id: user.id }, data: { status: $Enums.UserStatus.ACTIVE } })
        await this.prisma.token.deleteMany({ where: { userId: user.id, type: $Enums.TokenType.REFRESH, deviceId } })
        await this.prisma.token.create({
            data: { userId: user.id, token: hashRefreshToken, type: $Enums.TokenType.REFRESH, deviceId, ip, expiredAt: this.expiredAt(process.env.COOKIE_EXPIRES_REFRESH) }
        })
        this.setAuthCookies(res, accessToken, refreshToken, user.id);
        user.password = ''
        return { user }
    }

    async refresh(refreshToken: string, userId: number, deviceInfo: DeviceInfo, ip: string, res: Response): Promise<{ message: string }> {
        console.log(`Début du refresh pour User ID: ${userId} | Device: ${deviceInfo.deviceId}`);
        try {
            // Utilisation d'une transaction pour l'atomicité (lecture -> verif -> rotation)
            const result = await this.prisma.$transaction(async (prisma) => {
                const { deviceId, deviceName } = deviceInfo;

                // 1. Chercher le token spécifique à cet appareil et cet utilisateur
                const existingToken = await prisma.token.findUnique({
                    where: { userId_type_deviceId: { userId, type: $Enums.TokenType.REFRESH, deviceId } }
                });

                // 2. Si aucun token n'existe pour cet appareil, c'est suspect ou une première connexion expirée
                if (!existingToken) throw new HttpException('Refresh token not found', 401);

                // 3. Vérifier la validité cryptographique du token fourni par rapport au hash en BDD
                const isTokenValid = await argon2.verify(existingToken.token, refreshToken);

                if (!isTokenValid) {
                    // Gestion de l'erreur critique (tentative de fraude ou corruption)
                    await this.handleRefreshError(userId, refreshToken, existingToken, res);
                    throw new HttpException('Invalid Refresh Token', 401);
                }

                // 4. Rotation : On supprime l'ANCIEN token (celui qu'on vient d'utiliser)
                await prisma.token.delete({
                    where: { userId_type_deviceId: { userId, type: $Enums.TokenType.REFRESH, deviceId } }
                });

                // 5. Génération des nouveaux secrets
                const accessToken = await this.generateAccessToken(userId);
                const newRefresh = await this.generateRefreshToken(userId);

                // 6. Sauvegarde du NOUVEAU token en base
                await prisma.token.create({
                    data: {
                        userId,
                        token: newRefresh.hashRefreshToken, // Le hash sécurisé
                        type: $Enums.TokenType.REFRESH,
                        ip,
                        deviceId,
                        deviceName,
                        expiredAt: this.expiredAt(process.env.COOKIE_EXPIRES_REFRESH)
                    }
                });
                return { accessToken, refreshToken: newRefresh.refreshToken };
            }, {
                maxWait: 5000,
                timeout: 20000
            });
            // 7. Mise à jour des cookies client
            this.setAuthCookies(res, result.accessToken, result.refreshToken, userId);
            console.log(`Refresh réussi pour User ID: ${userId} | Device: ${deviceInfo.deviceId}`);
            return { message: 'Token rafraichi avec succès' };

        } catch (error) {
            this.setAuthCookiesLoggout(res);
            if (error instanceof HttpException) throw error;
            throw new HttpException('Erreur lors du rafraîchissement', 500);
        }
    }

    // Méthode helper pour alléger le code principal (à ajouter dans ta classe)
    private async handleRefreshError(userId: number, receivedToken: string, dbToken: any, res: Response) {
        const decoded: any = this.jwtService.decode(receivedToken);

        await this.mailerService.sendDevelopmentEmail(
            'Échec critique du rafraîchissement (Token Mismatch)',
            `<p>L'utilisateur <strong>${userId}</strong> a tenté d'utiliser un token invalide.</p> <hr>
         <p><strong>Token reçu :</strong> ${receivedToken}</p>
         <p><strong>Hash en BDD :</strong> ${dbToken?.token}</p>
         <p><strong>Info JWT :</strong> ${JSON.stringify(decoded)}</p>`
        );
    }

    ////LOGOUT
    async logOut(userId: number, deviceInfo: DeviceInfo, res: Response): Promise<{ message: string }> {
        const { deviceId } = deviceInfo
        if (userId) await this.prisma.token.deleteMany({ where: { userId, deviceId, type: $Enums.TokenType.REFRESH } });
        res.clearCookie(process.env.ACCESS_COOKIE_NAME);
        res.clearCookie(process.env.REFRESH_COOKIE_NAME);
        this.setAuthCookiesLoggout(res);
        return { message: 'Vous etes deconnecté' }
    }

    async deletAccount(userId: number, deviceInfo: DeviceInfo): Promise<{ message: string }> {
        const { deviceId, deviceName } = deviceInfo
        const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
        const deleteToken = await this.generateVerifyToken(user.id);
        const userToken = await this.prisma.token.findFirst({ where: { userId: userId, type: $Enums.TokenType.DELETE, deviceId } });
        userToken && await this.prisma.token.delete({ where: { userId_type_deviceId: { userId: userId, type: $Enums.TokenType.DELETE, deviceId } } });
        await this.prisma.token.create({ data: { userId: user.id, token: deleteToken.hashToken, type: $Enums.TokenType.DELETE, deviceId, deviceName } })
        this.mailerService.sendDeleteAccountEmail(user.email, deleteToken.token);
        return { message: 'Un email avec le lien de suppression vous a été envoyé' }
    }

    async deletAccountConfirm(userId: number, email: string, deleteToken: string, deviceInfo: DeviceInfo): Promise<{ message: string }> {
        const { deviceId } = deviceInfo
        const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
        if (user.email !== email) throw new HttpException('msg: Vous n\'avez pas le droit de supprimer ce compte', 403);
        const userToken = await this.prisma.token.findFirst({ where: { userId: userId, type: $Enums.TokenType.DELETE, deviceId } });
        const deleteTokenValid = await argon2.verify(userToken.token, deleteToken.trim());
        if (!deleteTokenValid) throw new HttpException('msg: Vous n\'avez pas le droit de supprimer ce compte', 403);
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

    /// GEMINI OPENID CORRECTION - Version ajustée de VOTRE code
    async validateAndProcessOidcUser(oidcUserDto: AuthUserGoogle): Promise<User & { Profile: Profile | null }> {
        let { provider, providerId, email, firstName, lastName, image } = oidcUserDto;
        //image = image.split('=')[0];
        this.logger.log(`[OIDC-${provider}] Validation pour: ${email}, ProviderID: ${providerId}`);
        if (!email) throw new HttpException('Email is required', 400);

        // 1. Rechercher l'utilisateur par provider et providerId
        let user = await this.prisma.user.findUnique({ where: { provider_providerId: { provider, providerId } }, include: { Profile: true } });

        if (user) { // CAS 1: Utilisateur trouvé par providerId
            if (user.status !== UserStatus.ACTIVE)
                await this.prisma.user.update({ where: { id: user.id }, data: { status: UserStatus.ACTIVE } })

            if (user.Profile) {
                const data: Partial<Profile> = {
                    ...(firstName && !user.Profile.firstName && { firstName }),
                    ...(lastName && !user.Profile.lastName && { lastName }),
                    ...(image && !user.Profile.image && { image }),
                }
                Object.keys(data).length > 0 && await this.prisma.profile.update({ where: { userId: user.id }, data })

            } else {
                if (!firstName || !lastName) throw new HttpException('Prénom et nom sont requis', 400)
                await this.prisma.profile.create({ data: { userId: user.id, firstName, lastName, image } })
            }
            // Recharger pour s'assurer que toutes les infos sont à jour unucessary requete using 
            return this.prisma.user.findUniqueOrThrow({ where: { id: user.id }, include: { Profile: true } });
        }

        // 2. Utilisateur NON trouvé par providerId. Rechercher par email pour LIAISON.
        this.logger.log(`[OIDC-${provider}] Non trouvé par providerId. Recherche par email: ${email}`);
        const userByEmail = await this.prisma.user.findUnique({ where: { email }, include: { Profile: true } })
        //----
        if (userByEmail) {
            user = await this.prisma.user.update({
                where: { id: userByEmail.id },
                data: {
                    provider,
                    providerId,
                    status: UserStatus.ACTIVE,
                    lastConnection: new Date(),
                },
                include: { Profile: true },
            });

            // Mettre à jour ou créer le profil pour cet utilisateur lié
            if (user.Profile) {
                const data: Partial<Profile> = {
                    ...(firstName && user.Profile.firstName !== firstName && { firstName }),
                    ...(lastName && user.Profile.lastName !== lastName && { lastName }),
                    ...(image && user.Profile.image !== image && { image }),
                }
                Object.keys(data).length > 0 && await this.prisma.profile.update({ where: { userId: user.id }, data })
            }
            else await this.prisma.profile.create({
                data: { userId: user.id, firstName, lastName, image }
            });
            return this.prisma.user.findUniqueOrThrow({ where: { id: user.id }, include: { Profile: true } });
        }

        // 3. Utilisateur NON trouvé par email. Créer un nouvel utilisateur.
        this.logger.log(`[OIDC-${provider}] Aucun utilisateur. Création pour: ${email}`);
        if (!firstName || !lastName) throw new HttpException('Prénom et nom sont requis du fournisseur OIDC pour créer un profil.', 400)
        return this.prisma.user.create({
            data: {
                email,
                provider,
                providerId,
                status: UserStatus.ACTIVE,
                lastConnection: new Date(),
                Profile: { create: { firstName, lastName, image } },
            },
            include: { Profile: true },
        });
    }

    /// LOGIN FOR OIDC
    async login(user: User, deviceInfo: DeviceInfo, ip: string): Promise<{ accessToken: string; refreshToken: string, user: User }> {
        const { deviceId, deviceName } = deviceInfo
        const accessToken = await this.generateAccessToken(user.id);
        const refreshToken = await this.generateRefreshToken(user.id);
        await this.prisma.token.deleteMany({ where: { userId: user.id, type: $Enums.TokenType.REFRESH, deviceId } });
        await this.prisma.token.create({
            data: {
                userId: user.id,
                token: refreshToken.hashRefreshToken,
                type: $Enums.TokenType.REFRESH,
                ip,
                deviceId,
                deviceName,
                expiredAt: this.expiredAt(process.env.COOKIE_EXPIRES_REFRESH),
            }
        });
        return { accessToken, refreshToken: refreshToken.refreshToken, user };
    }

}

