import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class Address {
    id: number;
    zipcode: number;
    city: string;
    country?: string;
    address: string;
    lat: number;
    long: number;
    createdAt: number;
    updatedAt: number;

    constructor(
        id: number,
        zipcode: number,
        city: string,
        country: string,
        address: string,
        lat: number,
        long: number,
        createdAt: number,
        updatedAt: number
    ) {
        this.id = id;
        this.zipcode = zipcode;
        this.city = city;
        this.country = country;
        this.address = address;
        this.lat = lat;
        this.long = long;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
export class AddressEntity implements Address {

    @ApiProperty()
    id: number;
    @ApiProperty()
    zipcode: number
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
    createdAt: number;
    @ApiProperty()
        updatedAt: number
      

  }