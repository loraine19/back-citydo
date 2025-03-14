import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { $Enums, User, Profile } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { UserNotifInfo } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService, private mailer: MailerService) { }

  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }

  async create(user: UserNotifInfo, data: CreateNotificationDto) {
    if (user.Profile.mailSub === data.level) {
      this.mailer.sendNotificationEmail([user.email], data);
    }
    return this.prisma.notification.create({ data: { userId: user.id, ...data } });
  }

  async createMany(users: UserNotifInfo[], data: CreateNotificationDto) {
    users.forEach((user) => {
      if (user.Profile.mailSub === data.level) {
        this.mailer.sendNotificationEmail([user.email], data)
      }
      return this.prisma.notification.create({ data: { userId: user.id, ...data } });
    })
  }

  async findAll(page: number, userId: number, filter: $Enums.NotificationType) {
    const skip = page ? this.skip(page) : 0;
    const where = filter ? { userId, type: filter, read: false } : { userId, read: false };
    console.log('where', where)
    const count = await this.prisma.notification.count({ where });
    const take = page ? this.limit : count;
    const notifs = await this.prisma.notification.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } });
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
