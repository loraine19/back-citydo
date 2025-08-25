import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { $Enums, MailSubscriptions, NotificationLevel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { UserNotifInfo } from './entities/notification.entity';
import { NotifsGateway } from 'src/notifs/notifs.gateway';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService, private mailer: MailerService, private notifsGateway: NotifsGateway) { }

  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }
  sendMail = process.env.SEND_MAIL === 'true'
  sendInstant = process.env.SEND_WS === 'true'


  private compare = (a: MailSubscriptions, b: NotificationLevel): boolean => {
    const aNumber = parseInt(b.toString().replace('SUB_', ''))
    const bNumber = parseInt(a.toString().replace('SUB_', ''))
    if (typeof aNumber !== 'number' || typeof bNumber !== 'number') return false
    return aNumber >= bNumber
  }

  async create(user: UserNotifInfo, data: CreateNotificationDto) {
    if (this.compare(user.Profile.mailSub, data.level) && this.sendMail) {
      this.mailer.sendNotificationEmail([user.email], data);
    }
    const notification = await this.prisma.notification.create({ data: { userId: user.id, ...data } });
    if (this.sendInstant) this.notifsGateway.sendNotificationToUser(user.id.toString(), notification)
    return notification
  }

  async createMany(users: UserNotifInfo[], data: CreateNotificationDto) {
    for (const user of users) {
      if (this.compare(user.Profile.mailSub, data.level) && this.sendMail) {
        this.mailer.sendNotificationEmail([user.email], data);
      }

      const notification = await this.prisma.notification.create({ data: { userId: user.id, ...data } });
      if (this.sendInstant) this.notifsGateway.sendNotificationToUser(user.id.toString(), notification);
    }
  }

  async findAll(page: number, userId: number, filter: string, map: boolean) {
    const skip = (page && page !== 0) ? this.skip(page) : 0;
    const convertFilter: $Enums.NotificationType[] = filter ? filter.includes(',')
      ? filter.split(',').map(f => $Enums.NotificationType[f as keyof typeof $Enums.NotificationType])
      : [$Enums.NotificationType[filter as keyof typeof $Enums.NotificationType]] : [];
    let where: any = filter ?
      { userId, type: { in: convertFilter }, read: false } :
      { userId, read: false };
    where = map ? { ...where, addressId: { not: null } } : where;
    const count = await this.prisma.notification.count({ where });
    const countMsg = await this.prisma.notification.count({ where: { userId, type: $Enums.NotificationType.MESSAGE, read: false } });
    const countOther = await this.prisma.notification.count({ where: { userId, type: { not: $Enums.NotificationType.MESSAGE }, read: false } });
    const take = (page && page !== 0) ? this.limit : count;
    const notifs = await this.prisma.notification.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { Address: true } });
    console.log({ count, countMsg, countOther });
    return { notifs, count, countMsg, countOther };
  }

  findOne(id: number, userId: number) {
    return this.prisma.notification.findUniqueOrThrow({ where: { id, userId } });
  }

  update(id: number, userId: number) {
    return this.prisma.notification.update({ where: { id, userId }, data: { read: true } });
  }

  updateAll(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false }, data: { read: true }
    })
  }

  remove(id: number, userId: number) {
    return this.prisma.notification.delete({ where: { id, userId } });
  }



}
