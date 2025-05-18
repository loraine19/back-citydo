// src/auth/authGoogle.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthUserGoogle } from './dto/authUserGoogle.dto';
import { UserProvider } from '@prisma/client';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: `${process.env.STORAGE}/api/auth/google/redirect`,
            scope: ['openid', 'email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, name, emails, photos } = profile;

        if (!emails || emails.length === 0 || !emails[0].value) {
            return done(new HttpException('Aucun email retourné par le fournisseur Google OIDC.', HttpStatus.BAD_REQUEST), false);
        }

        const googleUserDto: AuthUserGoogle = {
            provider: UserProvider.GOOGLE,
            providerId: id,
            email: emails[0].value,
            firstName: name?.givenName,
            lastName: name?.familyName,
            image: photos?.[0]?.value,
        }
        try {
            const user = await this.authService.validateAndProcessOidcUser(googleUserDto);
            if (!user) {
                // Normalement, validateAndProcessOidcUser devrait lancer une erreur si échec
                return done(new HttpException('Impossible de valider ou traiter l\'utilisateur OIDC via AuthService.', HttpStatus.INTERNAL_SERVER_ERROR), false);
            }
            done(null, user); // user est l'utilisateur de votre BDD, incluant Profile
        } catch (err) {
            // Passer l'erreur à Passport pour qu'elle soit gérée (potentiellement par vos filtres)
            done(err, false);
        }
    }
}