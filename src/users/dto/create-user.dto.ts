import { ApiProperty } from "@nestjs/swagger";
import { User, UserEntity } from "../entities/user.entity";
import { isNumber, IsString } from "class-validator";
import { IsDate } from "@nestjs/class-validator";

export class CreateUserDto extends UserEntity{}  