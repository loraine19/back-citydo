import { ApiBody, ApiConsumes, ApiProperty, PartialType } from "@nestjs/swagger";
import { EventEntity } from "../entities/event.entity";
import { IsNotEmpty, IsString, IsDate, IsNumber, IsOptional, IsEnum } from "class-validator";
import { $Enums } from "@prisma/client";
import { Optional, ParseFilePipe, ParseIntPipe, UsePipes } from "@nestjs/common";
import { Transform } from "class-transformer";



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
    @IsNotEmpty({ message: 'Participants min is required' })
    @IsNumber()
    participantsMin: number;


    @ApiProperty({ enum: $Enums.EventCategory })
    @IsNotEmpty()
    @IsEnum($Enums.EventCategory, { message: 'Category mus be part of ' + Object.values($Enums.EventCategory).join(', ') })
    category: $Enums.EventCategory


    @ApiProperty({ type: 'string', format: 'binary', required: false, })
    image: string;

}