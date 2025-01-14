import { Issue, IssueStep } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class IssueEntity implements Issue {
    @ApiProperty()
    @IsNotEmpty({ message: 'The id should not be empty' })
    @IsNumber({}, { message: 'The id must be a number' })
    id: number;

    @ApiProperty()
    @IsDate({ message: 'The createdAt must be a valid date' })
    @IsNotEmpty({ message: 'The createdAt should not be empty' })
    createdAt: Date;

    @ApiProperty()
    @IsDate({ message: 'The updatedAt must be a valid date' })
    @IsNotEmpty({ message: 'The updatedAt should not be empty' })
    updatedAt: Date;

    ///FOR DTO
    @ApiProperty()
    @IsNumber({}, { message: 'The userId must be a number' })
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

    @ApiProperty()
    @IsNotEmpty({ message: 'The status should not be empty' })
    @IsEnum(IssueStep, { message: 'The status must be a part of ' + Object.values(IssueStep).join(', ') })
    status: IssueStep;

    @ApiProperty()
    @IsNumber({}, { message: 'The userIdModo must be a number' })
    userIdModo: number;

    @ApiProperty()
    @IsNumber({}, { message: 'The userIdModo2 must be a number' })
    userIdModoResp: number;

    @ApiProperty()
    @IsString({ message: 'The image must be a link' })
    image: string | null;
}
