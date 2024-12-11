import { PartialType } from "@nestjs/swagger";
import { Entity } from "../entities/participant.entity";
import { IsNotEmpty } from "class-validator";

export class CreateParticipantDto extends PartialType(Entity) {
    @IsNotEmpty()
    userId: number;
    @IsNotEmpty()
    eventid: number;
}
