import { createParamDecorator, ExecutionContext, HttpException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        const token = request.cookies[process.env.ACCESS_COOKIE_NAME];
        if (token) {
            const jwtService = new JwtService();
            try {
                const payload = jwtService.verify(token, { secret: process.env.JWT_SECRET });
                return parseInt(payload.sub);
            } catch (error) {
                console.error('Erreur de décodage du token:', error);
                return null;
            }
        } else {
            return null;
        }
    },
);



export const GetRefreshToken = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        //  const [type, token] = request.headers.authorization?.split(' ') ?? [];
        // const refreshToken = type === 'Bearer' ? token : undefined;
        const refreshToken = request.cookies[process.env.REFRESH_COOKIE_NAME];
        if (!refreshToken) {
            throw new HttpException('deco Refresh token not found ' + process.env.REFRESH_COOKIE_NAME, 401);
        }
        const jwtService = new JwtService();
        try {
            const payload = jwtService.decode(refreshToken) as { sub: string };
            const userId = payload.sub;
            return { refreshToken, userId };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    })

export interface DeviceInfo {
    deviceId: string;
    deviceName: string;
}
export const DeviceId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): DeviceInfo => {
        const request = ctx.switchToHttp().getRequest();

        // if (request.body && request.body.deviceId) {
        //     return request.body.deviceId;
        // }

        // // 2. CAS GOOGLE (Optionnel) : Si tu utilises le cookie relais temporaire
        // if (request.cookies && request.cookies['temp_device_id']) {
        //     return request.cookies['temp_device_id'];
        // }

        // 3. CAS AUTOMATIQUE (Fallback) : Génération depuis le User-Agent
        // C'est ta solution "magique" qui marche tout le temps sans config front
        const userAgent = request.headers['user-agent'] || 'unknown-agent';

        // On crée une signature unique (Hash MD5) basée sur le navigateur/OS
        return { deviceId: crypto.createHash('md5').update(userAgent).digest('hex'), deviceName: userAgent }
    },


)
