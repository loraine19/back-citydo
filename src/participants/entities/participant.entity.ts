import { ApiProperty } from "@nestjs/swagger";
import { Participant, User } from "@prisma/client";
import { IsDate, IsNotEmpty, IsOptional } from "class-validator";

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

    @ApiProperty()
    @IsOptional()
    User: User
}
