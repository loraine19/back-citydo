import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, isDate, IsEmail, IsNotEmpty, IsNumber, isNumber, IsString, MinLength } from 'class-validator';
import { User } from '../../class'

export class UserEntity implements User {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    @IsString()
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'password is required' })
    @IsString()
    @MinLength(6)
    password: string;
}

