import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import { IsString, IsNotEmpty, IsBoolean, IsEnum, IsNumber, IsArray } from "class-validator";

export class CreateProfileDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    userIdSp: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty()
    addressId: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    avatar: Uint8Array<ArrayBufferLike>;

    @ApiProperty()
    @IsBoolean()
    addressShared: boolean;

    @ApiProperty()
    @IsEnum($Enums.Assistance, { message: 'Assistance must be part of ' + $Enums.Assistance })
    assistance: $Enums.Assistance;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    points: number;

    @ApiProperty()
    @IsArray()
    skills: string;
}
