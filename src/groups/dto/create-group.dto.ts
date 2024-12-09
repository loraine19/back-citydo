import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateGroupDto {

    @ApiProperty()
    address_id: number;
    @ApiProperty()
    area: number;
    @ApiProperty()
    rules: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
}