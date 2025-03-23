import { Injectable, CanActivate, ExecutionContext, HttpException } from "@nestjs/common";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { WsException } from "@nestjs/websockets";
import * as cookie from 'cookie';

declare module 'socket.io' {
    interface Socket {
        user?: number; // Or whatever type your user ID is (e.g., string, object)
        // user?: { id: number; username: string; /* ... other properties ... */ }; // Example with a more complex user object
    }
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = await context.switchToHttp().getRequest();
        //  console.log(request.cookies)
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
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new HttpException('Refresh token not found', 403);
        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET_REFRESH });
            request['user'] = payload
            return true;
        }
        catch (error) {
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
        if (context.getType() !== 'ws') {
            console.error('WS Guard used in a non-WS context');
            return true; // Or throw an error, depending on your needs.
        }
        const client = context.switchToWs().getClient<Socket>();
        const handshake = client.handshake;
        const cookies = cookie.parse(handshake.headers.cookie || '');
        const token = cookies[process.env.ACCESS_COOKIE_NAME]; // Use the environment variable

        if (!token) {
            throw new WsException('Unauthorized: No access_token cookie found');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,

            });
            client.user = payload.sub;
            return true; // Authentication successful

        } catch (error) {
            console.error('JWT Verification Error (WS):', error);
            throw new WsException('Unauthorized: Invalid token');
        }
    }
}