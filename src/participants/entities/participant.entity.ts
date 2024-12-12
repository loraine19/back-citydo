import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { Participant } from "src/class";

export class ParticpantEntity extends PartialType(Participant) {
    @ApiProperty()
    @IsNotEmpty()
    userId: number;

    @ApiProperty()
    @IsNotEmpty()
    eventId: number;
}
