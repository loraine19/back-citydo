import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { first } from 'rxjs';
import { $Enums } from '@prisma/client';
import { UserNotifInfo } from 'src/notifications/entities/notification.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {

  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) { }

  includeUsersConfig = {
    User:
      { select: { id: true, email: true, Profile: { select: { mailSub: true, image: true, firstName: true, lastName: true } } } },
    UserRec:
      { select: { id: true, email: true, Profile: { select: { mailSub: true, image: true, firstName: true, lastName: true } } } }
  }

  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }

  async create(data: CreateMessageDto) {
    const { userId, userIdRec, ...message } = data;
    const messageCreated = await this.prisma.message.create({
      data: { ...message, User: { connect: { id: userId } }, UserRec: { connect: { id: userIdRec } } },
      include: this.includeUsersConfig
    });
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, Profile: { select: { mailSub: true, image: true, firstName: true, lastName: true } } } });
    const userRec = await this.prisma.user.findUnique({ where: { id: userIdRec }, select: { id: true, email: true, Profile: { select: { mailSub: true, image: true, firstName: true, lastName: true } } } });
    const notification = {
      type: $Enums.NotificationType.MESSAGE,
      level: $Enums.NotificationLevel.SUB_2,
      title: `Nouveau message`,
      description: `Vous avez reçu un message de ${user.Profile.firstName} ${user.Profile.lastName}`,
      link: `/chat/${messageCreated.id}`,

    }
    await this.notificationsService.create(new UserNotifInfo(userRec), notification);
  }

  async findAll(userId: number, page: number): Promise<{ conversations: Message[], count: number }> {
    const skip = (page && page !== 0) ? this.skip(page) : 0;
    const where = {
      OR: [
        { userId },
        { userIdRec: userId }
      ],
      NOT: {
        AND: [
          { userId: { in: [userId] } },
          { userIdRec: { in: [userId] } }
        ]
      }
    }
    const count = await this.prisma.message.count({ where });
    const take = (page && page !== 0) ? this.limit : count;
    const data = await this.prisma.message.findMany({
      skip,
      take,
      where,
      include: this.includeUsersConfig,
      orderBy: { createdAt: 'desc' }
    });
    const conversations = data.reduce((acc, message) => {
      const { userId, userIdRec } = message;
      if (!acc.some(m => (m.userId === userId && m.userIdRec === userIdRec) || (m.userId === userIdRec && m.userIdRec === userId))) {
        acc.push(message);
      }
      return acc;
    }, []);

    return { conversations, count: conversations.length };
  }


  async findConversation(userId: number, id: number, page: number): Promise<{ messages: Message[], count: number }> {
    const skip = (page && page !== 0) ? this.skip(page) : 0;
    const where = {
      OR: [
        { userId, userIdRec: id },
        { userId: id, userIdRec: userId }
      ]
    }
    const count = await this.prisma.message.count({ where });
    const take = (page && page !== 0) ? this.limit : count;
    const messages = await this.prisma.message.findMany({
      skip,
      take,
      where,
      include: this.includeUsersConfig,
      orderBy: { createdAt: 'desc' }
    },
    );
    return { messages, count };
  }

  async findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  readConversation(userId: number, id: number) {
    return this.prisma.message.updateMany({
      where: {
        userId: id,
        userIdRec: userId
      },
      data: {
        read: true
      }
    })
  }


  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
