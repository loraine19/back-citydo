import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsDate, IsOptional } from "class-validator";
import { $Enums, Group } from "@prisma/client";

export
  class GroupEntity implements Group {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;

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
  category: $Enums.GroupCategory;
}