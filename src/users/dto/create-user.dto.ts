import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";
import { isNumber } from "class-validator";
import { IsDate } from "@nestjs/class-validator";

export class CreateUserDto{
    @ApiProperty()
id: number;
    @ApiProperty()
        
created_at: Date;

@ApiProperty()
updated_at: Date;

@ApiProperty()
lastConnection: Date

@ApiProperty()
email: string;

password: string;
}