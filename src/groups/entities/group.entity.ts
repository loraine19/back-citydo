import { ApiProperty, PartialType } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class Group {
    id: number;
    addressId: number;
    area: number;
    rules: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        addressId: number,
        area: number,
        rules: string,
        name: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.addressId = addressId;
        this.area = area;
        this.rules = rules;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export class GroupEntity extends PartialType(Group)  {
    @ApiProperty()
    addressId: number;
    @ApiProperty()
    area: number;
    @ApiProperty()
    rules: string;
    @ApiProperty()
    name: string;
  }