import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Survey, Vote } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsNumber, IsNotEmpty, IsDate, IsString, IsEnum, IsOptional } from "class-validator";

export interface SurveyWithVote extends Survey {
    votes: any;
}
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
    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'User id is required' })
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
    status: $Enums.PoolSurveyStatus;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    groupId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    neededVotes: number;
}

