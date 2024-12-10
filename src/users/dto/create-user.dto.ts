import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";
import { isNumber, IsString } from "class-validator";
import { IsDate } from "@nestjs/class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  email: string;
  @ApiProperty()
  password: string;

}