import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
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
    @IsEnum($Enums.PostCategory, { message: 'category must be part of ' + $Enums.PostCategory })
    category: $Enums.PostCategory;

    @ApiProperty()
    @IsOptional()
    image: Uint8Array<ArrayBufferLike>;

    @ApiProperty()
    @IsEnum($Enums.Share)
    share: $Enums.Share;
}
