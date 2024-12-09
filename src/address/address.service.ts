import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Address, Group } from '@prisma/client';


//// SERVICE MAKE ACTION
@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}
  async create(createGroupDto: CreateAddressDto ) {
    return await this.prisma.address.create({
     data: createGroupDto
    });
  }
  
 async findAll() :Promise <Address[]> {
    return await this.prisma.address.findMany();
  }

  async findOne(id: number): Promise<Address> {
    return await this.prisma.address.findUnique({ where: { id } });
  }

  async update(id: number, updateGroupDto: UpdateAddressDto):Promise<Address> {
    return await this.prisma.address.update({
      where: { id },
      data: updateGroupDto
    });
  }

 async remove(id: number):Promise<Address> {
    return await this.prisma.address.delete({ where: { id } });
  }
}
