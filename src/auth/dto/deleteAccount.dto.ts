import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class DeleteAccountDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    deleteToken: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    email: string;

}