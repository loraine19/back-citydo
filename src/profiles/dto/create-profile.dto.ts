import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsBoolean, IsEnum, IsNumber, IsArray } from "class-validator";

export class CreateProfileDto {
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
    skills: string[];
}
