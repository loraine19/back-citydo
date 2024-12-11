import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Event} from "@prisma/client";

export class Entity extends PartialType(Event) {
    // @ApiProperty()
    // id: number

    @ApiProperty()
    title: string

    @ApiProperty()
    description: string

    @ApiProperty()
    start : Date | string

    @ApiProperty()
    end: Date | string
    
    @ApiProperty()
    addressId: number

    @ApiProperty()
    userId: number

    @ApiProperty()
    category: string

    @ApiProperty()
    image: string | null

    @ApiProperty()
    participantsMin: number

}
  