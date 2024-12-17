import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { GroupUser } from "src/class";
import { $Enums } from '@prisma/client';

export class GroupUserEntity implements GroupUser {
    @ApiProperty()
    @IsDate()
    updatedAt: Date

    @ApiProperty()
    @IsDate()
    createdAt: Date

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    groupId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty()
    @IsEnum($Enums.Role)
    @IsNotEmpty()
    role: $Enums.Role;
}
