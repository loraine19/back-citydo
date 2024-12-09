import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateGroupDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    address_id: number;
    @ApiProperty()
    area: number;
    @ApiProperty()
    rules: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    created_at: Date;
    @ApiProperty()
    updated_at: Date;
}