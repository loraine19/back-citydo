import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Address } from '@prisma/client';


//// SERVICE MAKE ACTION
@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateDto ) {
    return await this.prisma.address.create({
     data
    });
  }
  
 async findAll() :Promise<Address[]> {
    return await this.prisma.address.findMany();
  }

  async findOne(id: number): Promise<Address> {
    return await this.prisma.address.findUnique({
      where: { id },
    include: { Group: true },});
  }

  async update(id: number, data: UpdateDto):Promise<Address> {
    return await this.prisma.address.update({
      where: { id },
      data
    });
  }

 async remove(id: number):Promise<Address> {
    return await this.prisma.address.delete({ where: { id } });
  }
}
