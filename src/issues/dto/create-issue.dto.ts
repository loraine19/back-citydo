import { ApiProperty } from "@nestjs/swagger";
import { IssueStep } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateIssueDto {
    ///FOR DTO
    @ApiProperty({ required: false })
    @Type(() => Number)
    @IsNumber({}, { message: 'The userId must be a number' })
    @IsOptional()
    userId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'The serviceId should not be empty' })
    @IsNumber({}, { message: 'The serviceId must be a number' })
    serviceId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'The description should not be empty' })
    @IsString({ message: 'The description must be a string' })
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'The date should not be empty' })
    @IsDate({ message: 'The date must be a valid date' })
    date: Date;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(IssueStep, { message: 'The status must be a part of ' + Object.values(IssueStep).join(', ') })
    status: IssueStep;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'The userIdModo must be a number' })
    userIdModo: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'The userIdModo2 must be a number' })
    userIdModo2: number;

    @ApiProperty()
    @IsString({ message: 'The image must be a link' })
    image: string | null;
}
