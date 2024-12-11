import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';


//// SERVICE MAKE ACTION
@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateDto ) {
    return await this.prisma.event.create({
     data
    });
  }
  
 async findAll() :Promise<Event[]> {
    return await this.prisma.event.findMany();
  }

  async findOne(id: number): Promise<Event> {
    return await this.prisma.event.findUnique({
      where: { id },
    include: { UserEvent: { include: { User: true } } },});
  }

  async update(id: number, data: UpdateDto):Promise<Event> {
    return await this.prisma.event.update({
      where: { id },
      data
    });
  }

 async remove(id: number):Promise<Event> {
    return await this.prisma.event.delete({ where: { id } });
  }
}
