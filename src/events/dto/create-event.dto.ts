import { ApiBody, ApiConsumes, ApiProperty, PartialType } from "@nestjs/swagger";
import { EventEntity } from "../entities/event.entity";
import { IsNotEmpty, IsString, IsDate, IsNumber, IsOptional, IsEnum } from "class-validator";
import { $Enums } from "@prisma/client";
import { Optional, ParseFilePipe, ParseIntPipe, UsePipes } from "@nestjs/common";
import { Transform } from "class-transformer";



export class CreateEventDto {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'Title is required' })
    @IsString()
    title: string

    @ApiProperty()
    @IsNotEmpty({ message: 'Description is required' })
    @IsString()
    description: string

    @ApiProperty({ type: Date })
    @IsNotEmpty({ message: 'Start date is required' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'Start date is not conformè' })
    @Transform(({ value }) => new Date(value))
    start: Date

    @ApiProperty({ type: Date })
    @IsNotEmpty({ message: 'End date is required' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'End date is not conforme' })
    end: Date

    @ApiProperty({ type: 'number' })
    @IsNotEmpty({ message: 'Address id is required' })
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    addressId: number

    @ApiProperty({ type: 'number' })

    @IsNotEmpty({ message: 'User id is required' })
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    userId: number

    @ApiProperty({ type: 'number' })
    @IsNotEmpty({ message: 'Participants min is required' })
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    participantsMin: number;


    @ApiProperty({ enum: $Enums.EventCategory })
    @IsNotEmpty()
    @IsEnum($Enums.EventCategory, { message: 'Category mus be part of ' + Object.values($Enums.EventCategory).join(', ') })
    category: $Enums.EventCategory


    @ApiProperty({ type: 'string', format: 'binary', required: false, })
    @IsOptional()
    image: any;

}