import { Injectable, CanActivate, ExecutionContext, HttpException } from "@nestjs/common";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = await context.switchToHttp().getRequest();
        const token = request.cookies['access'];
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