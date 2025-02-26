import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
}
