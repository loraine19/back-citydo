import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import { IsNumber, IsNotEmpty, IsEnum, IsOptional } from "class-validator";

export class CreateGroupUserDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    groupId: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    userId: number;

    @ApiProperty()
    @IsEnum($Enums.Role, { message: 'role must be part of ' + $Enums.Role })
    @IsNotEmpty()
    role: $Enums.Role;
}
