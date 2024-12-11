import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Address } from 'src/class';

export class Entity  {
    @ApiProperty()
    zipcode: string
    @ApiProperty()
    city: string;
    @ApiProperty()
    address: string;
    @ApiProperty()
    lat: number 
  @ApiProperty()
  lng: number 

}
// extends PartialType(Address)