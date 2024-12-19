import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express';
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(process.env.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ])
        // PUBLIC 
        if (isPublic) return true;

        // PRIVATE
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException();
        try {
            /// VERIFY TOKEN - duree integrite signature 
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
            /// ADD PAYLOAD TO REQUEST WITH USER KEY
            request['user'] = payload
        }
        catch (error) { throw new UnauthorizedException(error) }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}