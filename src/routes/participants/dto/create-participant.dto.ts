import { ApiProperty, PartialType } from "@nestjs/swagger";
import { ParticpantEntity } from "../entities/participant.entity";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateParticipantDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    eventId: number;
}
