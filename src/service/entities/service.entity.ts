import { ApiProperty } from "@nestjs/swagger";
import { IsDate, isDate, isEnum, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class Service {
    @ApiProperty()
    @IsNotEmpty({ message: 'is required' })
    @IsNumber()
    id: number;
    @ApiProperty()
    @IsNumber()
    userId: number;
    @ApiProperty()
    @IsNumber()
    userIdResp: number;
    @ApiProperty()
    @IsNotEmpty({ message: 'is required' })
    @IsEnum(['GET', 'DO'])
    type: 'GET' | 'DO';
    @ApiProperty()
    @IsNotEmpty({ message: 'is required' })
    @IsString()
    title: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'is required' })
    @IsString()
    description: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'is required' })
    @IsEnum(['CATEGORY_1', 'CATEGORY_2', 'CATEGORY_3', 'CATEGORY_4'])
    category: "CATEGORY_1" | "CATEGORY_2" | "CATEGORY_3" | "CATEGORY_4";
    @ApiProperty()
    @IsNotEmpty({ message: 'is required' })
    @IsEnum(['SKILL_0', 'SKILL_1', 'SKILL_2', 'SKILL_3'])
    skill: "SKILL_0" | "SKILL_1" | "SKILL_2" | "SKILL_3";
    @ApiProperty()
    @IsNotEmpty({ message: 'is required' })
    @IsEnum(['HARD_0', 'HARD_1', 'HARD_2', 'HARD_3'])
    hard: "HARD_0" | "HARD_1" | "HARD_2" | "HARD_3";
    @ApiProperty()
    @IsNotEmpty({ message: 'is required' })
    @IsEnum(['POST', 'RESP', 'VALIDATE', 'FINISH', 'ISSUE'])
    status: "POST" | "RESP" | "VALIDATE" | "FINISH" | "ISSUE";
    @ApiProperty()
    @IsDate()
    createdAt: Date;
    @ApiProperty()
    @IsDate()
    updatedAt: Date;
    @ApiProperty()
    @IsOptional()
    image?: Blob;
}