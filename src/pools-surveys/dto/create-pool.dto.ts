import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePoolDto {
    //FOR DTO
    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
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
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    groupId: number;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    neededVotes: number;

    @ApiProperty({ type: Date })
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'Start date is not conformè' })
    createdAt: Date
}
