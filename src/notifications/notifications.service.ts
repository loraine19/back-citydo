import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { $Enums, User, Profile, MailSubscriptions, NotificationLevel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { UserNotifInfo } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService, private mailer: MailerService) { }

  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }
  sendMail = process.env.SEND_MAIL === 'true'

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
    return this.prisma.notification.create({ data: { userId: user.id, ...data } });
  }

  async createMany(users: UserNotifInfo[], data: CreateNotificationDto) {
    users.forEach((user) => {
      if (this.compare(user.Profile.mailSub, data.level) && this.sendMail) {
        this.mailer.sendNotificationEmail([user.email], data)
      }
      return this.prisma.notification.create({ data: { userId: user.id, ...data } });
    })
  }

  async findAll(page: number, userId: number, filter: $Enums.NotificationType) {
    const skip = page ? this.skip(page) : 0;
    const where = filter ? { userId, type: filter, read: false } : { userId, read: false };
    const count = await this.prisma.notification.count({ where });
    const take = page ? this.limit : count;
    const notifs = await this.prisma.notification.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { Address: true } });
    return { notifs, count };
  }

  findOne(id: number, userId: number) {
    return this.prisma.notification.findUniqueOrThrow({ where: { id, userId } });
  }

  update(id: number, userId: number) {
    return this.prisma.notification.update({ where: { id, userId }, data: { read: true } });
  }

  remove(id: number, userId: number) {
    return this.prisma.notification.delete({ where: { id, userId } });
  }
}
