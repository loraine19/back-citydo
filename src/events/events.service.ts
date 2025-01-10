import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Event } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ImageInterceptor } from 'middleware/ImageInterceptor';

//// SERVICE MAKE ACTION
@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateEventDto): Promise<Event> {
    const { userId, addressId, ...event } = data
    return await this.prisma.event.create({
      data: { ...event, Address: { connect: { id: addressId } }, User: { connect: { id: userId } } }
    });
  }

  async findAll(): Promise<Event[]> {
    return await this.prisma.event.findMany(
      {
        include: {
          User: { select: { email: true, Profile: true } },
          Participants: {
            include: { User: { select: { email: true, Profile: true, id: true } } }
          },
          Address: true
        }
      }
    );
  }

  async findAllByUserId(userId: number): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Participants: { include: { User: { select: { email: true, Profile: true, id: true } } } },
        Address: true
      }
    })
    //if (!events.length) throw new HttpException(`no events found`, HttpStatus.NO_CONTENT);
    return events
  }

  async findAllByParticipantId(userId: number): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { Participants: { some: { userId } } },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Participants: { include: { User: { select: { email: true, Profile: true, id: true } } } },
        Address: true
      }
    })
    //if (!events.length) throw new HttpException(`no events found`, HttpStatus.NO_CONTENT);
    return events
  }

  async findAllValidated(): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      include: {
        User: { select: { email: true, Profile: true } },
        Participants: { include: { User: { select: { email: true, Profile: true, id: true } } } },
        Address: true
      }
    });
    return events.filter(event => event.Participants.length >= event.participantsMin);
  }


  async findOne(id: number): Promise<Event> {
    return await this.prisma.event.findUniqueOrThrow({
      where: { id },
      include: {
        User: { select: { email: true, Profile: true } },
        Participants: { include: { User: { select: { email: true, Profile: true, id: true } } } },
        Address: true
      },
    });
  }

  async update(updateId: number, data: UpdateEventDto): Promise<Event> {
    const { userId, addressId, ...event } = data
    return await this.prisma.event.update({
      where: { id: updateId },
      data: { ...event, Address: { connect: { id: addressId } }, User: { connect: { id: userId } } }
    });
  }


  async remove(id: number): Promise<Event> {
    const element = await this.prisma.event.findUniqueOrThrow({ where: { id } });
    element.image && ImageInterceptor.deleteImage(element.image);
    return await this.prisma.event.delete({ where: { id } });
  }
}
