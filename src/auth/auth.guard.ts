import { Injectable, CanActivate, ExecutionContext, HttpException, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { WsException } from "@nestjs/websockets";
import * as cookie from 'cookie';
import { PassportStrategy } from "@nestjs/passport";
import { $Enums } from "@prisma/client";
import { Strategy, VerifyCallback } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

declare module 'socket.io' {
    interface Socket {
        user?: number;
    }
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = await context.switchToHttp().getRequest();
        const token = request.cookies[process.env.ACCESS_COOKIE_NAME];
        if (!token) throw new HttpException('Unauthorized access, missing token', 401);
        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
            request['user'] = payload;
            return true;
        }
        catch (error) {
            console.log(error)
            throw new HttpException('Unauthorized access', 401)
        }
    }
}

@Injectable()
export class AuthGuardRefresh implements CanActivate {
    constructor(private jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = await context.switchToHttp().getRequest();
        //  const token = this.extractTokenFromHeader(request);
        const token = request.cookies[process.env.REFRESH_COOKIE_NAME];
        if (!token) throw new HttpException('Refresh token not found guard' + process.env.REFRESH_COOKIE_NAME, 403);
        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET_REFRESH });
            request['user'] = payload
            return true
        }
        catch (error) {
            console.log(error, token)
            throw new HttpException('Guard :' + error, 401)
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

}

@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (context.getType() !== 'ws') throw new WsException('Malformed access to websocket');
        const client = context.switchToWs().getClient<Socket>();
        const handshake = client.handshake;
        const cookies = cookie.parse(handshake.headers.cookie || '');
        const token = cookies[process.env.ACCESS_COOKIE_NAME];
        if (!token) { throw new WsException('Unauthorized access to websocket'); }
        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
            client.user = payload.sub;
            return true;
        }
        catch (error) {
            console.error('JWT Verification Error (WS):', error);
            throw new WsException('Unauthorized access to websocket');
        }
    }
}
@Injectable()
export class AuthGuardGoogle extends AuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        return super.canActivate(context);
    }
}

