import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional, IsArray } from "class-validator";
import { arrayBuffer } from 'stream/consumers';

export class CreatePostDto {
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
