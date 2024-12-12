import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { Participant } from "src/class";

export class Entity extends PartialType(Participant) {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNotEmpty()
    eventId: number;
}
