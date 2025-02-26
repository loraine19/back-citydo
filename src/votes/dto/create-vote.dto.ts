import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import { IsNotEmpty, IsEnum, IsOptional } from "class-validator";

export class CreateVoteDto {
    /// FOR DTO 
    @ApiProperty()
    @IsOptional()
    userId?: number;

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
