import { ApiProduces, ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Profile } from '@prisma/client';

export class ProfileEntity implements Profile {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    id: number;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;


    ///FOR DTO
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    userIdSp: number;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    addressId: number;

    @ApiProperty()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    avatar: string;

    @ApiProperty()
    @IsBoolean()
    addressShared: boolean;

    @ApiProperty()
    @IsEnum(['NONE', 'LOW', 'MEDIUM', 'HIGH'])
    assistance: "NONE" | "LOW" | "MEDIUM" | "HIGH";

    @ApiProperty()
    @IsNumber()
    points: number;

    @ApiProperty()
    @IsArray()
    skills: string;
}
