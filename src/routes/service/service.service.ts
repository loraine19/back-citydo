import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Service } from '@prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

//// SERVICE MAKE ACTION
@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateServiceDto): Promise<Service> {
    const { userId, userIdResp, ...service } = data
    return await this.prisma.service.create({ data: { ...service, UserService: { connect: { id: userId } }, UserServiceResp: { connect: { id: userIdResp } } } })
  }

  async findAll(): Promise<Service[]> {
    return await this.prisma.service.findMany();
  }


  async findOne(id: number): Promise<Service> {
    return await this.prisma.service.findUniqueOrThrow({
      where: { id },
      include: { UserService: true, UserServiceResp: true }

    });
  }

  async update(id: number, data: any): Promise<Service> {
    const { userId, userIdResp, ...service } = data
    return await this.prisma.service.update({
      where: { id },
      data: { ...service, UserService: { connect: { id: userId } }, UserServiceResp: { connect: { id: userIdResp } } }
    });
  }

  async remove(id: number): Promise<Service> {
    return await this.prisma.service.delete({ where: { id } });
  }
}
