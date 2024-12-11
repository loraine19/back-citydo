import { ApiProperty, PartialType } from "@nestjs/swagger";
import { EventEntity } from "../entities/event.entity";


export class CreateEventDto extends (EventEntity) { }
