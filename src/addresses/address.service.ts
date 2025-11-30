import { Injectable } from '@nestjs/common';
import { Address } from '@prisma/client';
import { CreateAddressDto } from './dto/create-address.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateAddressDto): Promise<Address> {
    const address = await this.prisma.address.create({
      data
    })
    return address;
  }

  async findAll(): Promise<Address[]> {
    return await this.prisma.address.findMany();
  }

  async findOne(id: number): Promise<Address> {
    return await this.prisma.address.findUniqueOrThrow({
      where: { id },
      include: { Groups: true, Profiles: true },
    });
  }

  async findUnique(address: string, zipcode: string): Promise<Address> {
    return await this.prisma.address.findUnique({ where: { address_zipcode: { address, zipcode } } });
  }

  async verifyAddress(data: CreateAddressDto): Promise<number> {
    const { address, zipcode } = data;
    const exist = await this.prisma.address.findUnique({ where: { address_zipcode: { address, zipcode } } })
    if (exist) return exist.id
    const newAddress = await this.prisma.address.create({ data })
    return newAddress.id;
  }


}
