import { ApiProperty } from "@nestjs/swagger";


export class CreateAddressDto {
    @ApiProperty()
    zipcode: number;
    @ApiProperty()
    city: string;
    @ApiProperty()
    country: string;
    @ApiProperty()
    address: string;
    @ApiProperty()
    lat: number;
    @ApiProperty()
    long: number;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date
}
