import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import { IsNotEmpty, IsEnum } from "class-validator";

export class CreateFlagDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'userId should not be empty' })
    userId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'targetId should not be empty' })
    targetId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'targetType should not be empty' })
    @IsEnum($Enums.FlagTarget, { message: 'targetType must be part of ' + Object.values($Enums.FlagTarget).join(', ') })
    target: $Enums.FlagTarget

    @ApiProperty()
    @IsNotEmpty({ message: 'reason should not be empty' })
    @IsEnum($Enums.FlagReason, { message: 'reason must be part of ' + Object.values($Enums.FlagReason).join(', ') })
    reason: $Enums.FlagReason;
}
