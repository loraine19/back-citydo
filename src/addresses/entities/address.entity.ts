import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Address } from '@prisma/client';
import { Decimal, DecimalJsLike } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';


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

  /// FOR DTO 
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
  @Type(() => Decimal)
  @IsNumber({}, { message: 'Latitude must be a number' })
  lat: Decimal;


  @ApiProperty()
  @IsNotEmpty({ message: 'Longitude is required' })
  @Type(() => Decimal)
  @IsNumber({}, { message: 'Longitude must be a number' })
  lng: Decimal;

  @ApiProperty()
  @IsNotEmpty({ message: 'Zipcode is required' })
  @IsString({ message: 'Zipcode must be a string' })
  zipcode: string
}