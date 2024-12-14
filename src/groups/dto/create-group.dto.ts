import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { GroupEntity } from "../entities/group.entity";



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
}