import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";

export class CreateMessageDto {
    userId?: number;
    userIdRec: number;
    message: string;

    @ApiProperty({ type: Date })
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'Start date is not conformè' })
    createdAt?: Date
}
