import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException } from "@nestjs/common";
import { Request } from 'express';
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = await context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException('no token provided');
        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
            request['user'] = payload
        }
        catch (error) {
            //throw new HttpException('invalid token guard ' + error, 401) 
            // if throw access request block incoming refresh request 
            console.log('error', error)

        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        console.log('request.headers.authorization', request.headers.authorization)
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}