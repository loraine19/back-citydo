import { ApiProperty, PartialType } from "@nestjs/swagger";
import { AddressEntity } from "../entities/address.entity";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";



export class CreateAddressDto {

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


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    zipcode: string
    @ApiProperty()
    @IsNotEmpty()
    city: string;
    @ApiProperty()
    address: string;
    @IsNotEmpty()
    @ApiProperty()
    lat: number
    @IsNotEmpty()
    @ApiProperty()
    lng: number
}