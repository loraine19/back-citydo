import { ApiProperty } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/library";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAddressDto {

    @ApiProperty()
    @IsNotEmpty({ message: 'Zipcode is required' })
    @IsString({ message: 'Zipcode must be a string' })
    zipcode: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'City is required' })
    @IsString({ message: 'City must be a string' })
    city: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Address is required' })
    @IsString({ message: 'Address must be a string' })
    address: string;

    @IsNotEmpty({ message: 'Latitude is required' })
    @ApiProperty()
    @IsNumber({}, { message: 'Latitude must be a number' })
    lat: Decimal;

    @IsNumber({}, { message: 'Longitude must be a number' })
    @IsNotEmpty({ message: 'Longitude is required' })
    @ApiProperty()
    lng: Decimal
}