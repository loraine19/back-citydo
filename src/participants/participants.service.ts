import { HttpException, Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Participant } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserNotifInfo } from 'src/notifications/entities/notification.entity';
import { UsersService } from 'src/users/users.service';


//// SERVICE MAKE ACTION
@Injectable()
export class ParticipantsService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService, private usersService: UsersService) { }

  userIncludeConfig = { id: true, email: true, GroupUser: true, Profile: { select: { mailSub: true, firstName: true } } }
  private groupSelectConfig = (userId: number) => ({ GroupUser: { some: { userId } } })

  async create(data: CreateParticipantDto): Promise<any> {
    const { userId, eventId } = data;
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: this.userIncludeConfig });
    const event = await this.prisma.event.findUnique({ where: { id: eventId, Group: this.groupSelectConfig(userId) }, select: { title: true, start: true, Address: true, Participants: true, participantsMin: true, groupId: true, Group: { include: { GroupUser: true } }, User: { select: this.userIncludeConfig } } });
    if (!event) throw new HttpException('msg: L\'événement n\'existe pas, ou n\'est pas dans votre groupe', 404);
    const participantsCount = event.Participants.length
    const users = await this.usersService.usersInGroup(event.User.id, event.groupId)
    const isValided = (participantsCount + 1) >= event.participantsMin
    const participation = await this.prisma.participant.create({
      data: {
        User: { connect: { id: userId } },
        Event: { connect: { id: eventId } },
      }
    });


    const notification1 = {
      type: $Enums.NotificationType.PARTICIPANT,
      level: $Enums.NotificationLevel.SUB_2,
      title: `Nouveau participant`,
      description: `${user.Profile.firstName} participe à votre événement ${event.title} ${isValided && 'et a validé l\'événement'}`,
      link: `/evenement/${eventId}`,
    }
    const notification2 = {
      type: $Enums.NotificationType.PARTICIPANT,
      level: $Enums.NotificationLevel.SUB_2,
      title: `Participation confirmée`,
      description: `à l'événement ${event.title} le ${event.start.toLocaleDateString()} ${isValided && "l'événement} a été validé"}`,
      link: `/evenement/${eventId}`,
      addressId: event.Address.id
    }
    await this.notificationsService.create(new UserNotifInfo(event.User), notification1);
    await this.notificationsService.create(new UserNotifInfo(user), notification2);
    if (isValided) {
      await this.prisma.event.update({ where: { id: eventId }, data: { status: $Enums.EventStatus.VALIDATED } })
      const notification3 = {
        type: $Enums.NotificationType.PARTICIPANT,
        level: $Enums.NotificationLevel.SUB_2,
        title: `Événement validé`,
        description: `Votre événement ${event.title} a été validé`,
        link: `/evenement/${eventId}`,
      }
      await this.notificationsService.createMany(users, notification3);
    }
    return { ...participation, User: user }
  }


  async remove(userId: number, eventId: number): Promise<Participant> {
    return await this.prisma.participant.delete({ where: { userId_eventId: { userId, eventId } }, });
  }
}