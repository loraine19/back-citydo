import { ApiProperty, PartialType } from "@nestjs/swagger";
import { AddressEntity } from "../entities/address.entity";


export class CreateAddressDto extends (AddressEntity) {}
