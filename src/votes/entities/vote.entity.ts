import { ApiProperty } from "@nestjs/swagger";
import { Vote, $Enums } from '@prisma/client';
import { IsDate, IsEnum, isEnum, IsNotEmpty } from "class-validator";

export class VoteEntity implements Vote {

    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    /// FOR DTO 
    @ApiProperty()
    @IsNotEmpty()
    userId: number;

    @ApiProperty()
    @IsNotEmpty()
    targetId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum($Enums.VoteTarget, { message: 'targetType must be part of ' + $Enums.VoteTarget })
    target: $Enums.VoteTarget

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum($Enums.VoteOpinion, { message: 'opinion must be part of ' + $Enums.VoteOpinion })
    opinion: $Enums.VoteOpinion;
}
