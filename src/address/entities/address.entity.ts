import { ApiProperty, PartialType } from '@nestjs/swagger';
import { User } from "@prisma/client";

export class Address {
    id: number;
    zipcode: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        zipcode: string,
        city: string,
        address: string,
        lat: number,
        lng: number,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.zipcode = zipcode;
        this.city = city;
        this.address = address;
        this.lat = lat;
        this.lng = lng;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
export class AddressEntity extends PartialType(Address) {
    @ApiProperty()
    zipcode: string
    @ApiProperty()
    city: string;
    @ApiProperty()
    address: string;
    @ApiProperty()
    lat: number;
    @ApiProperty()
    lng: number
  }