import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { $Enums, Event, MailSubscriptions, Profile } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { MailerService } from 'src/mailer/mailer.service';
import { ActionType } from 'src/mailer/constant';
import { AddressService } from 'src/addresses/address.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService, private mailer: MailerService, private addressService: AddressService) { }

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



  async findAll(userId: number, page?: number, category?: string): Promise<{ events: Event[], count: number }> {
    const skip = page ? this.skip(page) : 0;
    const count = await this.prisma.event.count();
    const take = page ? this.limit : count;
    const where: { category?: $Enums.EventCategory } = category ? { category: $Enums.EventCategory[category] } : {}
    const events = await this.prisma.event.findMany({
      skip,
      take,
      where,
      include: this.eventIncludeConfig(userId),
      orderBy: { start: 'asc' }
    }) || [];
    return { events, count }
  }

  async findAllByUserId(userId: number, page?: number, category?: string): Promise<{ events: Event[], count: number }> {
    const skip = page ? this.skip(page) : 0;
    const count = await this.prisma.event.count({ where: { userId } });
    const take = page ? this.limit : await this.prisma.event.count({ where: { userId } });
    const where = category ? { userId, category: $Enums.EventCategory[category] } : { userId }
    const events = await this.prisma.event.findMany({
      skip,
      take,
      where,
      include: this.eventIncludeConfig(userId),
    }) || [];
    return { events, count }
  }

  async findAllByParticipantId(userId: number, page?: number, category?: string): Promise<{ events: Event[], count: number }> {
    const skip = page ? this.skip(page) : 0;
    const count = await this.prisma.event.count({ where: { Participants: { some: { userId } } } });
    const take = page ? this.limit : count;
    const where = category ? { category: $Enums.EventCategory[category], Participants: { some: { userId } } } : { Participants: { some: { userId } } }
    const events = await this.prisma.event.findMany({
      skip,
      take,
      where,
      include: this.eventIncludeConfig(userId)
      , orderBy: { start: 'asc' }
    })
    return { events, count }
  }

  async findAllValidated(userId: number, page?: number, category?: string): Promise<{ events: Event[], count: number }> {
    const where: { category?: $Enums.EventCategory } = category ? { category: $Enums.EventCategory[category] } : {}
    const events = await this.prisma.event.findMany({
      where,
      include: this.eventIncludeConfig(userId),
      orderBy: { start: 'asc' }
    });
    const eventsValidated = events.filter(event => event.Participants.length >= event.participantsMin)
    const count = eventsValidated.length;
    const skip = page ? this.skip(page) : 0;
    const take = page ? this.limit : count;
    const paginatedEvents = eventsValidated.slice(skip, skip + take);
    if (page) return { events: paginatedEvents, count };
    return { events: eventsValidated, count }
  }


  async findOne(id: number, userId: number): Promise<Event> {
    return await this.prisma.event.findUniqueOrThrow({
      where: { id },
      include: this.eventIncludeConfig(userId),
    });
  }


  //// ACTIONS
  async create(data: CreateEventDto): Promise<Event> {
    const { userId, addressId, Address, ...event } = data
    const addressIdVerified = await this.addressService.verifyAddress(Address);
    return await this.prisma.event.create({
      data: { ...event, Address: { connect: { id: addressIdVerified } }, User: { connect: { id: userId } } }
    });
  }

  async update(updateId: number, data: UpdateEventDto, userIdC: number): Promise<Event> {
    const { userId, addressId, Address, ...event } = data;
    if (userIdC !== userId) throw new HttpException('Vous n\'avez pas les droits de modifier cet évènement', 403)
    const addressIdVerified = await this.addressService.verifyAddress(Address);
    console.log('addressIdVerified', addressIdVerified)
    const eventUpdated = await this.prisma.event.update({
      where: { id: updateId },
      include: this.eventIncludeConfig(userId),
      data: {
        ...event, Address: { connect: { id: addressIdVerified } }, User: { connect: { id: userId } },
      }
    });
    if (eventUpdated) {
      const MailList = eventUpdated.Participants.map(p => this.mailer.level(p.User.Profile) > 1 ? p.User.email : null).filter(email => email)
      console.log(MailList)
      MailList.length > 0 && this.mailer.sendNotificationEmail(MailList, event.title, updateId, 'evenement', ActionType.UPDATE)
    }
    return eventUpdated
  }


  async remove(id: number, userId: number): Promise<Event> {
    const element = await this.prisma.event.findUniqueOrThrow({ where: { id } });
    if (userId !== element.userId) throw new HttpException('Vous n\'avez pas les droits de modifier cet évènement', 403)
    element.image && ImageInterceptor.deleteImage(element.image);
    const event = await this.prisma.event.delete({ where: { id }, include: { Participants: { select: { User: { include: { Profile: true } } } } } });
    if (event) {
      this.mailer.sendNotificationEmail(event.Participants.map(p => this.mailer.level(p.User.Profile) > 1 && p.User.email), event.title, event.id, 'evenement', ActionType.DELETE)
    }
    return event
  }
}
