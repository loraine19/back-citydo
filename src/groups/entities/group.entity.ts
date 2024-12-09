import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class Group {
    id: number;
    address_id: number;
    area: number;
    rules: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        address_id: number,
        area: number,
        rules: string,
        name: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.address_id = address_id;
        this.area = area;
        this.rules = rules;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export class GroupEntity implements Group {

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
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
      

  }