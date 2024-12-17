import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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