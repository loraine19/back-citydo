import { Injectable } from '@nestjs/common';
import { Address, User } from '@prisma/client';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from '../prisma/prisma.service';

//// SERVICE MAKE ACTION
@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateAddressDto): Promise<Address> {
    return await this.prisma.address.create({
      data
    });
  }

  async findAll(): Promise<Address[]> {
    return await this.prisma.address.findMany();
  }

  async findOne(id: number): Promise<Address> {
    return await this.prisma.address.findUniqueOrThrow({
      where: { id },
      include: { Group: true, Profile: true },
    });
  }

  async findOneByUserId(userId: number): Promise<Address> {
    return await this.prisma.address.findFirstOrThrow({
      where: { Profile: { some: { userId } } },
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
