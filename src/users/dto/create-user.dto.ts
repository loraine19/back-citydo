import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";
import { isNumber } from "class-validator";
import { IsDate } from "@nestjs/class-validator";

export class CreateUserDto{
  @ApiProperty()      
createdAt: Date;

@ApiProperty()
updatedAt: Date;

@ApiProperty()
lastConnection: Date

@ApiProperty()
email: string;
@ApiProperty()
password: string;
}