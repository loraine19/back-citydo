import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Address } from 'src/class';

export class AddressEntity implements Address {

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
// extends PartialType(Address)