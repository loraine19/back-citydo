import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUser } from './dto/authUser.dto';

@Injectable()
export class GoogleAuthGuard extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: `${process.env.STORAGE}/auth/google/redirect`,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        googleProfile: GoogleProfile,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, photos, phone_number, address , sub } = googleProfile;
        const email: string = emails[0].value;
        const firstName = name.givenName;
        const lastName = name.familyName;
        const imageUrl = photos[0].value;

        const authUser: AuthUser = { email, image: imageUrl, firstName, lastName, phone: phone_number, address , sub }
        try {
            const authUser = await this.authService.googleAuth(authUser)
            return done(null, authUser)


        } catch (error) {
            console.log(error);
            return done(error, false);
        }
    }
}