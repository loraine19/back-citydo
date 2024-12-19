import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Event } from '@prisma/client';
;
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EventEntity implements Event {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    //// FOR DTO 

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
    @IsNotEmpty({ message: 'Start date is required' })
    start: Date

    @ApiProperty()
    @IsNotEmpty({ message: 'End date is required' })
    @IsDate({ message: 'End date is required' })
    end: Date

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: 'Address id is required' })
    addressId: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: 'User id is required' })
    userId: number

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum($Enums.EventCategory, { message: 'Category mus be part of ' + Object.values($Enums.EventCategory).join(', ') })
    category: $Enums.EventCategory

    @ApiProperty()
    @IsOptional()
    image: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: 'Participants min is required' })
    participantsMin: number
}
