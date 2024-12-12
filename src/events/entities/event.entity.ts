import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Event } from "@prisma/client";
import { IsDate, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EventEntity extends PartialType(Event) {
    @ApiProperty()
    @IsNotEmpty({ message: 'Title is required' })
    @IsString()
    title: string

    @ApiProperty()
    @IsNotEmpty({ message: 'Description is required' })
    @IsString()
    description: string

    @ApiProperty()
    @IsDate({ message: 'Start date is required' })
    start: Date | string

    @ApiProperty()
    @IsDate({ message: 'End date is required' })
    end: Date | string

    @ApiProperty()
    @IsNumber()
    addressId: number

    @ApiProperty()
    @IsNumber()
    userId: number

    @ApiProperty()
    @IsNotEmpty()
    category: string

    @ApiProperty()
    @IsOptional()
    image: string | null

    @ApiProperty()
    @IsNotEmpty({ message: 'Participants min is required' })
    participantsMin: number
}
