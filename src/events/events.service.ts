import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

//// SERVICE MAKE ACTION
@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateEventDto): Promise<any> {
    return await this.prisma.event.create({ data })

  }

  async findAll(): Promise<Event[]> {
    return await this.prisma.event.findMany();
  }

  async findOne(id: number): Promise<Event> {
    return await this.prisma.event.findUnique({
      where: { id },
      include: { Participant: { include: { user: true } } },
    });
  }

  async update(id: number, data: UpdateEventDto): Promise<Event> {
    return await this.prisma.event.update({
      where: { id },
      data
    });
  }

  async remove(id: number): Promise<Event> {
    return await this.prisma.event.delete({ where: { id } });
  }
}
