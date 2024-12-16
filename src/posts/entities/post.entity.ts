import { ApiProperty } from "@nestjs/swagger";
import { Post } from "@prisma/client";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PostEntity implements Post {
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

    //FOR DTO 
    @ApiProperty()
    @IsNotEmpty({ message: 'user id is required' })
    @IsNumber()
    userId: number;

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
    @IsEnum(['CATEGORY_1', 'CATEGORY_2', 'CATEGORY_3', 'CATEGORY_4', 'CATEGORY_5'])
    category: "CATEGORY_1" | "CATEGORY_2" | "CATEGORY_3" | "CATEGORY_4" | "CATEGORY_5"

    @ApiProperty()
    @IsOptional()
    image: string;

    @ApiProperty()
    @IsEnum(['PHONE', 'EMAIL', 'BOTH'])
    share: "PHONE" | "EMAIL" | "BOTH";
}
