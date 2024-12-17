import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from "class-validator";

export class CreateSurveyDto {
    //FOR DTO
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum($Enums.SurveyCategory, { message: "Category must be part of " + $Enums.SurveyCategory })
    category: $Enums.SurveyCategory;

    @ApiProperty()
    @IsOptional()
    image: Uint8Array<ArrayBufferLike>;
}
