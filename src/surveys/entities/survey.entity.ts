import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Survey } from "@prisma/client";
import { IsNumber, IsNotEmpty, IsDate, IsString, IsEnum, IsOptional } from "class-validator";

export class SurveyEntity implements Survey {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

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
