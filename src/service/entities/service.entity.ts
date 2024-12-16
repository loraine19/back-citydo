import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Service } from "@prisma/client";

export class ServiceEntity implements Service {
    @ApiProperty()
    @IsNotEmpty({ message: 'id is required' })
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    ///FOR DTO

    @ApiProperty()
    @IsNotEmpty({ message: 'user idis required' })
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsNumber()
    userIdResp: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Type is required' })
    @IsEnum(['GET', 'DO'])
    type: 'GET' | 'DO';

    @ApiProperty()
    @IsNotEmpty({ message: 'title is required' })
    @IsString()
    title: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'description is required' })
    @IsString()
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'category is required' })
    @IsEnum(['CATEGORY_1', 'CATEGORY_2', 'CATEGORY_3', 'CATEGORY_4'])
    category: "CATEGORY_1" | "CATEGORY_2" | "CATEGORY_3" | "CATEGORY_4";

    @ApiProperty()
    @IsNotEmpty({ message: 'skill is required' })
    @IsEnum(['SKILL_0', 'SKILL_1', 'SKILL_2', 'SKILL_3'])
    skill: "SKILL_0" | "SKILL_1" | "SKILL_2" | "SKILL_3";

    @ApiProperty()
    @IsNotEmpty({ message: 'hard is required' })
    @IsEnum(['HARD_0', 'HARD_1', 'HARD_2', 'HARD_3'])
    hard: "HARD_0" | "HARD_1" | "HARD_2" | "HARD_3";

    @ApiProperty()
    @IsNotEmpty({ message: 'is required' })
    @IsEnum(['POST', 'RESP', 'VALIDATE', 'FINISH', 'ISSUE'])
    status: "POST" | "RESP" | "VALIDATE" | "FINISH" | "ISSUE";

    @ApiProperty()
    @IsOptional()
    @IsString()
    image: string;
}