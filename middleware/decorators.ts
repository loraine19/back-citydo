import { createParamDecorator, ExecutionContext, HttpException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';

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
        console.log('request.cookies', request.cookies)
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
    }


)