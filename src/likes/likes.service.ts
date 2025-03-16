import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { $Enums, Like } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { LikeWithUser } from './entities/like.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { UserNotifInfo } from 'src/notifications/entities/notification.entity';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) { }
  async create(data: CreateLikeDto): Promise<LikeWithUser> {
    const { userId, postId } = data;
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, Profile: { include: { Address: true } } } });
    const like = await this.prisma.like.create({
      data: {
        User: { connect: { id: userId } },
        Post: { connect: { id: postId } },
      },
    });
    const post = await this.prisma.post.findUnique({ where: { id: postId }, select: { title: true, User: { select: { id: true, email: true, Profile: { select: { mailSub: true } } } } } });
    const notification = {
      type: $Enums.NotificationType.LIKE,
      level: $Enums.NotificationLevel.SUB_2,
      title: `Nouveau like`,
      description: `${user.Profile.firstName} a liké votre annonce ${post.title}`,
      link: `/annonce/${postId}`
    }
    await this.notificationsService.create(new UserNotifInfo(post.User), notification);
    return { ...like, User: user }
  }


  async remove(userId: number, postId: number): Promise<Like> {
    return await this.prisma.like.delete({ where: { userId_postId: { userId, postId } } });
  }
}