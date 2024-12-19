import { ApiProperty } from '@nestjs/swagger';
import { Request } from 'express';

export class AuthEntity {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
}

export class RefreshEntity {
    @ApiProperty()
    userId: number;
    @ApiProperty()
    refreshToken: string;
}

export type RequestWithUser = Request & { user: { sub: number } };