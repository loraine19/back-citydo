import { ApiProperty, PartialType } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Group } from "src/class";


export class Entity extends PartialType(Group)  {
    @ApiProperty()
    addressId: number;
    @ApiProperty()
    area: number;
    @ApiProperty()
    rules: string;
    @ApiProperty()
    name: string;
  }