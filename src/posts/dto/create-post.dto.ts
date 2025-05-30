import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional, IsDate } from "class-validator";

export class CreatePostDto {
    //FOR DTO 
    @ApiProperty({ type: 'number', required: false })
    @IsOptional()
    @Type(() => Number)
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
    @IsNotEmpty({ message: 'share is required' })
    @IsEnum($Enums.Share, { message: 'share must be part of ' + Object.values($Enums.Share).join(', ') })
    share: $Enums.Share;

    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    groupId: number;

    @ApiProperty({ type: Date })
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'Start date is not conformè' })
    createdAt: Date
}
