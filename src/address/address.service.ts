import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Address } from '@prisma/client';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

//// SERVICE MAKE ACTION
@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateAddressDto) {
    return await this.prisma.address.create({
      data
    });
  }

  async findAll(): Promise<Address[]> {
    return await this.prisma.address.findMany();
  }

  async findOne(id: number): Promise<Address> {
    return await this.prisma.address.findUnique({
      where: { id },
    });
  }

  async findOneUsers(id: number): Promise<Address> {
    return await this.prisma.address.findUnique({
      where: { id },
      include: { Group: true },
    });
  }

  async update(id: number, data: UpdateAddressDto): Promise<Address> {
    return await this.prisma.address.update({
      where: { id },
      data
    });
  }

  async remove(id: number): Promise<Address> {
    return await this.prisma.address.delete({ where: { id } });
  }

}
