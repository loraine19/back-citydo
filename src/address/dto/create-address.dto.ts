import { ApiProperty, PartialType } from "@nestjs/swagger";
import { AddressEntity } from "../entities/address.entity";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";



export class CreateAddressDto {


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    zipcode: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    lat: number

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    lng: number
}