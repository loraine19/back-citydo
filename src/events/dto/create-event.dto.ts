import { ApiProperty, PartialType } from "@nestjs/swagger";
import { EventEntity } from "../entities/event.entity";
import { IsNotEmpty, IsString, IsDate, IsNumber, IsOptional, IsEnum } from "class-validator";
import { $Enums } from "@prisma/client";


export class CreateEventDto {

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
    start: Date | string

    @ApiProperty()
    @IsNotEmpty({ message: 'End date is required' })
    @IsDate({ message: 'End date is required' })
    end: Date | string

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
    image: Uint8Array<ArrayBufferLike>;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: 'Participants min is required' })
    participantsMin: number
}