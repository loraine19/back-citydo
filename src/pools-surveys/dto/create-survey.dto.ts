import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from "class-validator";

export class CreateSurveyDto {
    //FOR DTO
    @ApiProperty({ type: 'string' })
    @IsOptional({ message: 'User id is required' })
    @Transform(({ value }) => parseInt(value))
    @IsNumber({ allowNaN: true }, { message: 'User id must be a number' })
    userId: number;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'Title is required' })
    @IsString({ message: 'Title must be a string' })
    title: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'Description is required' })
    @IsString({ message: 'Description must be a string' })
    description: string;

    @ApiProperty({ enum: $Enums.SurveyCategory })
    @IsNotEmpty()
    @IsEnum($Enums.SurveyCategory, { message: "Category must be part of " + Object.values($Enums.SurveyCategory).join(', ') })
    category: $Enums.SurveyCategory;

    @ApiProperty({ type: 'string', format: 'binary', required: false, })
    @IsOptional()
    image: string;

    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    groupId: number;
}
