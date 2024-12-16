import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsEnum, IsString, IsOptional } from "class-validator";

export class CreateServiceDto {

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
    @IsNumber()
    @IsNotEmpty({ message: 'User id is required' })
    userId: number
    @ApiProperty()
    @IsNumber()
    userIdResp: number
    @ApiProperty()
    @IsOptional()
    image?: string;

}
