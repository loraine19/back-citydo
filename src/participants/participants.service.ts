import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Participant } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserNotifInfo } from 'src/notifications/entities/notification.entity';


//// SERVICE MAKE ACTION
@Injectable()
export class ParticipantsService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) { }
  async create(data: CreateParticipantDto): Promise<any> {
    const { userId, eventId } = data;
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, Profile: true } });
    const participation = await this.prisma.participant.create({
      data: {
        User: { connect: { id: userId } },
        Event: { connect: { id: eventId } },
      }
    });
    const event = await this.prisma.event.findUnique({ where: { id: eventId }, select: { title: true, start: true, Address: true, User: { select: { id: true, email: true, Profile: { select: { mailSub: true } } } } } });
    const notification1 = {
      type: $Enums.NotificationType.PARTICIPANT,
      level: $Enums.NotificationLevel.SUB_2,
      title: `Nouveau participant`,
      description: `${user.Profile.firstName} participe à votre événement ${event.title}`,
      link: `/evenement/${eventId}`,
    }
    const notification2 = {
      type: $Enums.NotificationType.PARTICIPANT,
      level: $Enums.NotificationLevel.SUB_2,
      title: `Participation confirmée`,
      description: `à l'événement ${event.title} le ${event.start.toLocaleDateString()}`,
      link: `/evenement/${eventId}`,
      addressId: event.Address.id
    }
    await this.notificationsService.create(new UserNotifInfo(event.User), notification1);
    await this.notificationsService.create(new UserNotifInfo(user), notification2);
    return { ...participation, User: user }
  }


  async remove(userId: number, eventId: number): Promise<Participant> {
    return await this.prisma.participant.delete({ where: { userId_eventId: { userId, eventId } }, });
  }
}