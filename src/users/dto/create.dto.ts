import { ApiProperty } from "@nestjs/swagger";
import { Entity } from "../entities/entity";
import { isNumber, IsString } from "class-validator";
import { IsDate } from "@nestjs/class-validator";

export class CreateDto extends Entity{}  