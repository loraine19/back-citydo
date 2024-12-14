import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";
import { Participant } from "src/class";

export class ParticpantEntity implements Participant {

    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    @ApiProperty()
    @IsNotEmpty()
    userId: number;

    @ApiProperty()
    @IsNotEmpty()
    eventId: number;
}
