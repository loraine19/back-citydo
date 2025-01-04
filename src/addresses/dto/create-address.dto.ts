import { ApiProperty } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/library";
import { Transform } from "class-transformer";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAddressDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Address is required' })
    @IsString({ message: 'Address must be a string' })
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'City is required' })
    @IsString({ message: 'City must be a string' })
    city: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Latitude is required' })
    @Transform(({ value }) => parseFloat(value))
    @IsNumber({}, { message: 'Latitude must be a number' })
    lat: Decimal | number;


    @ApiProperty()
    @IsNotEmpty({ message: 'Longitude is required' })
    @Transform(({ value }) => parseFloat(value))
    @IsNumber({}, { message: 'Longitude must be a number' })
    lng: Decimal | number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Zipcode is required' })
    @IsString({ message: 'Zipcode must be a string' })
    zipcode: string;
}
