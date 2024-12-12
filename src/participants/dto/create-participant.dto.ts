import { PartialType } from "@nestjs/swagger";
import { ParticpantEntity } from "../entities/participant.entity";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateParticipantDto extends PartialType(ParticpantEntity) {
    @IsNotEmpty()
    @IsNumber()
    userId: number;
    @IsNotEmpty()
    @IsNumber()
    eventId: number;
}
