import { ApiProperty } from '@nestjs/swagger';
import { Request } from 'express';

export class AuthEntity {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
}

export type RequestWithUser = Request & { user: { sub: number } };