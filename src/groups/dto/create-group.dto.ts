import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { GroupEntity } from "../entities/group.entity";
import { $Enums } from "@prisma/client";



export class CreateGroupDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    addressId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    area: number;

    @ApiProperty()
    rules: string;

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum($Enums.GroupCategory, { message: 'category must be part of ' + Object.values($Enums.GroupCategory).join(', ') })
    category: $Enums.GroupCategory;
}