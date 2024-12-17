import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Address } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

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

  //FOR DTO
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
  lat: Decimal

  @IsNotEmpty()
  @ApiProperty()
  lng: Decimal
}