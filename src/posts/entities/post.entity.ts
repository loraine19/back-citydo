import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Post } from "@prisma/client";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
    @IsNumber({}, { message: 'user id must be a number' })
    userId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'title is required' })
    @IsString({ message: 'title must be a string' })
    title: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'description is required' })
    @IsString({ message: 'description must be a string' })
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'category is required' })
    @IsEnum($Enums.PostCategory, { message: 'category must be part of ' + Object.values($Enums.PostCategory).join(', ') })
    category: $Enums.PostCategory;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsOptional()
    @IsString({ message: 'image must be a link' })
    image: string;

    @ApiProperty({ enum: $Enums.Share })
    @IsEnum($Enums.Share)
    share: $Enums.Share;
}
