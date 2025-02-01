import { createParamDecorator, ExecutionContext, HttpException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        const token = request.cookies['access'];
        if (token) {
            const jwtService = new JwtService();
            try {
                const payload = jwtService.verify(token, { secret: process.env.JWT_SECRET });
                return payload.sub; // on retourne payload.sub qui contien UserId
            } catch (error) {
                console.error('Erreur de décodage du token:', error);
                return null;
            }
        } else {
            return null;
        }
    },
);

// const extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
// }

export const GetRefreshToken = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        const refreshToken = type === 'Bearer' ? token : undefined;
        if (!refreshToken) {
            throw new HttpException('Refresh token not found', 401);
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