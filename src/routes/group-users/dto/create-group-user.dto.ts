import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsEnum } from "class-validator";

export class CreateGroupUserDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    groupId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty()
    @IsEnum(['GUEST', 'MEMBER'])
    @IsNotEmpty()
    role: 'GUEST' | 'MEMBER'
}
