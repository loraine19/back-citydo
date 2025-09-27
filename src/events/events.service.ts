import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { $Enums, Event, Prisma } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { AddressService } from 'src/addresses/address.service';
import { Notification, UserNotifInfo } from '../notifications/entities/notification.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { EventFilter, EventFindParams, EventSort } from './constant';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService, private addressService: AddressService) { }

  private eventIncludeConfig(userId?: number) {
    return {
      User: { select: { email: true, Profile: { include: { Address: true } } } },
      Participants: { include: { User: { select: { email: true, Profile: { include: { Address: true } }, id: true, GroupUser: { include: { Group: { select: { name: true, id: true } } } } } } } },
      Address: true,
      Flags: { where: { target: $Enums.FlagTarget.EVENT, userId } },
      Group: { include: { GroupUser: true, Address: true } },
    }
  }

  private userSelectConfig = {
    id: true,
    email: true,
    Profile: { select: { mailSub: true } }
  }

  private groupSelectConfig = (userId: number) => ({ GroupUser: { some: { userId } } })
  private now = new Date().getTime();

  private sortBy = (sort: EventSort, reverse?: boolean): Prisma.EventOrderByWithRelationInput => {
    switch (sort) {
      case EventSort.AZ:
        return reverse ? { title: 'desc' } : { title: 'asc' };
      case EventSort.CREATED_AT:
        return reverse ? { createdAt: 'desc' } : { createdAt: 'asc' };
      case EventSort.INDAYS:
        return reverse ? { start: 'desc', status: 'asc' } : { start: 'asc', status: 'asc' };
      case EventSort.PARTICIPANTS:
        return reverse ? { Participants: { _count: 'asc' } } : { Participants: { _count: 'desc' } };
      default:
        return reverse ? { createdAt: 'desc' } : { createdAt: 'asc' }
    }
  }

  /// DEFAULTS VALUES 
  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }
  updateNotif = $Enums.NotificationLevel.SUB_2
  deleteNotif = $Enums.NotificationLevel.SUB_1


  //// CONSULT
  async findAll(userId: number, page?: number,
    params?: EventFindParams):
    Promise<{ events: Event[], count: number }> {
    const { category, filter, sort, reverse, search } = params;
    const skip = page ? this.skip(page) : 0;
    const Group = this.groupSelectConfig(userId);
    let where: Prisma.EventWhereInput = { Group, category };
    const whereSearch: Prisma.EventWhereInput = {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
        { User: { Profile: { firstName: { contains: search } } } },
      ]
    }
    if (search) {
      where = { ...where, ...whereSearch }
    }
    const orderBy = this.sortBy(sort as EventSort, reverse)
    switch (filter) {
      case EventFilter.MINE:
        where.userId = userId;
        break;
      case EventFilter.IGO:
        where.Participants = { some: { User: { id: userId } } }
        break;
      case EventFilter.VALIDATED:
        where.status = $Enums.EventStatus.VALIDATED;
        break;
    }
    const count = await this.prisma.event.count({ where });
    const take = page ? this.limit : count;
    const events = await this.prisma.event.findMany({
      skip,
      take,
      where,
      include: this.eventIncludeConfig(userId),
      orderBy
    });
    return { events, count }
  }





  async findOne(id: number, userId: number): Promise<Event> {
    return await this.prisma.event.findUniqueOrThrow({
      where: { id, Group: this.groupSelectConfig(userId) },
      include: this.eventIncludeConfig(userId),
    });
  }


  //// ACTIONS
  async create(data: CreateEventDto): Promise<Event> {
    const { userId, addressId, Address, groupId, ...event } = data
    const addressIdVerified = await this.addressService.verifyAddress(Address);
    const createdEvent = await this.prisma.event.create({
      data: {
        ...event,
        Address: { connect: { id: addressIdVerified } },
        User: { connect: { id: userId } },
        Group: { connect: { id: groupId } }
      }
    });
    const usersNotif = await this.prisma.user.findMany({ select: this.userSelectConfig })
    const notification = {
      type: $Enums.NotificationType.EVENT,
      title: `Nouvel évènement`,
      description: `${event.title} est proposé le ${event.start.toLocaleString()} à ${Address.city}, inscrivez-vous pour valider sa tenue`,
      link: `evenement/${createdEvent.id}`,
      level: $Enums.NotificationLevel.SUB_4,
      addressId: Address.id
    }
    this.notificationsService.createMany(usersNotif.map(user => new UserNotifInfo(user)), notification)
    return createdEvent
  }

  async update(updateId: number, data: UpdateEventDto, userIdC: number): Promise<Event> {
    const { userId, addressId, Address, groupId, ...event } = data;
    if (userIdC !== userId) throw new HttpException('msg: Vous n\'avez pas les droits de modifier cet évènement', 403)
    const addressIdVerified = await this.addressService.verifyAddress(Address);
    const eventUpdated = await this.prisma.event.update({
      where: { id: updateId },
      include: this.eventIncludeConfig(userId),
      data: {
        ...event,
        Address: { connect: { id: addressIdVerified } },
        User: { connect: { id: userId } },
        Group: { connect: { id: groupId } }
      }
    });
    if (eventUpdated) {
      const UserList = eventUpdated.Participants.map(p => new UserNotifInfo(p.User))
      const notification = new Notification({
        title: `${eventUpdated.title} à été modifié`,
        description: `L'évènement ${eventUpdated.title} à été modifié, veuillez consulter l'application pour plus de détails`,
        link: `/evenement/${eventUpdated.id}`,
        type: $Enums.NotificationType.EVENT,
        level: this.updateNotif,
        addressId: Address.id
      });
      await this.notificationsService.createMany(UserList, notification)
    }
    return eventUpdated
  }


  async remove(id: number, userId: number): Promise<Event> {
    const element = await this.prisma.event.findUniqueOrThrow({ where: { id } });
    if (userId !== element.userId) throw new HttpException('msg: Vous n\'avez pas les droits de modifier cet évènement', 403)
    element.image && ImageInterceptor.deleteImage(element.image);
    const event = await this.prisma.event.delete({ where: { id }, include: this.eventIncludeConfig(userId) });
    if (event) {
      const UserList = event.Participants.map(p => { return new UserNotifInfo(p.User) })
      const notification = new Notification({
        title: `${event.title} à été supprimé`,
        description: `L'évènement ${event.title} à été supprimé`,
        link: `evenement/${event.id}`,
        type: $Enums.NotificationType.EVENT,
        level: this.deleteNotif,
        addressId: event.Address.id
      });
      this.notificationsService.createMany(UserList, notification)
    }
    return event
  }
}
