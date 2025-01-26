import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { $Enums, Event } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ImageInterceptor } from 'middleware/ImageInterceptor';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateEventDto): Promise<Event> {
    const { userId, addressId, ...event } = data
    return await this.prisma.event.create({
      data: { ...event, Address: { connect: { id: addressId } }, User: { connect: { id: userId } } }
    });
  }

  private eventIncludeConfig(userId?: number) {
    return {
      User: { select: { email: true, Profile: { include: { Address: true } } } },
      Participants: { include: { User: { select: { email: true, Profile: true, id: true } } } },
      Address: true,
      Flags: { where: { target: $Enums.FlagTarget.EVENT, userId } }
    };
  }
  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }

  async findAll(userId: number, page?: number, category?: string): Promise<Event[]> {
    const skip = page ? this.skip(page) : 0;
    const take = page ? this.limit : await this.prisma.event.count();
    const where: { category?: $Enums.EventCategory } = category ? { category: $Enums.EventCategory[category] } : {}
    return this.prisma.event.findMany({
      skip,
      take,
      where,
      include: this.eventIncludeConfig(userId),
      orderBy: { start: 'asc' }
    }) || [];
  }

  async findAllByUserId(userId: number, page?: number, category?: string): Promise<Event[]> {
    const skip = page ? this.skip(page) : 0;
    const take = page ? this.limit : await this.prisma.event.count({ where: { userId } });
    const where = category ? { userId, category: $Enums.EventCategory[category] } : { userId }
    const events = await this.prisma.event.findMany({
      skip,
      take,
      where,
      include: this.eventIncludeConfig(userId),
    })
    return events || [];
  }

  async findAllByParticipantId(userId: number, page?: number, category?: string): Promise<Event[]> {
    const skip = page ? this.skip(page) : 0;
    const take = page ? this.limit : await this.prisma.event.count({ where: { Participants: { some: { userId } } } })
    const where = category ? { category: $Enums.EventCategory[category], Participants: { some: { userId } } } : { Participants: { some: { userId } } }
    const events = await this.prisma.event.findMany({
      skip,
      take,
      where,
      include: this.eventIncludeConfig(userId)
      , orderBy: { start: 'asc' }
    })
    return events
  }
  async findAllValidated(userId: number, page?: number, category?: string): Promise<Event[]> {
    const skip = page ? this.skip(page) : 0;
    const take = page ? this.limit * 4 : await this.prisma.event.count()
    const where: { category?: $Enums.EventCategory } = category ? { category: $Enums.EventCategory[category] } : {}
    const events = await this.prisma.event.findMany({
      skip,
      take,
      where,
      include: this.eventIncludeConfig(userId),
      orderBy: { start: 'asc' }
    });
    return events.filter(event => event.Participants.length >= event.participantsMin) || [];
  }


  async findOne(id: number, userId: number): Promise<Event> {
    return await this.prisma.event.findUniqueOrThrow({
      where: { id },
      include: this.eventIncludeConfig(userId),
    });
  }

  async update(updateId: number, data: UpdateEventDto, userIdC: number): Promise<Event> {
    const { userId, addressId, ...event } = data;
    console.log(userIdC, userId)
    if (userIdC !== userId) throw new HttpException('Vous n\'avez pas les droits de modifier cet évènement', 403)
    return await this.prisma.event.update({
      where: { id: updateId },
      data: { ...event, Address: { connect: { id: addressId } }, User: { connect: { id: userId } } }
    });
  }


  async remove(id: number, userId: number): Promise<Event> {
    const element = await this.prisma.event.findUniqueOrThrow({ where: { id } });
    if (userId !== element.userId) throw new HttpException('Vous n\'avez pas les droits de modifier cet évènement', 403)
    element.image && ImageInterceptor.deleteImage(element.image);
    return await this.prisma.event.delete({ where: { id } });
  }
}
