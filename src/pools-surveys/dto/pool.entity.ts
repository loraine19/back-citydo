import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Pool } from "@prisma/client";
import { IsNumber, IsNotEmpty, IsDate, IsString } from "class-validator";

export class PoolEntity implements Pool {
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
    @IsNumber()
    userIdBenef: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

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
