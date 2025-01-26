import { Injectable, CanActivate, ExecutionContext, HttpException } from "@nestjs/common";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = await context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request).trim();
        if (!token) throw new HttpException('Le token est manquant', 400);
        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
            request['user'] = payload
        }
        catch (error) {
            throw new HttpException('Guard :' + error, 401)
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}