import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Group } from "src/class";


export class GroupEntity extends PartialType(Group) {
  @ApiProperty()
  addressId: number;
  @ApiProperty()
  area: number;
  @ApiProperty()
  rules: string;
  @ApiProperty()
  name: string;
}