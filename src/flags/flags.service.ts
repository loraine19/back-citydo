import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFlagDto } from './dto/create-flag.dto';
import { UpdateFlagDto } from './dto/update-flag.dto';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Flag } from '@prisma/client';
import { FlagTarget } from './entities/constant';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Notification, UserNotifInfo } from 'src/notifications/entities/notification.entity';

@Injectable()
export class FlagsService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) { }

  private select = {
    id: true,
    email: true,
    Profile: { select: { mailSub: true } }
  }

  async create(data: CreateFlagDto): Promise<Flag> {

    const { userId, target, targetId, ...flag } = data;
    const exist = await this.prisma.flag.findUnique({ where: { userId_target_targetId: { userId, target, targetId } } });
    if (exist) throw new HttpException('msg: Vous avez deja signalé ce contenu', HttpStatus.CONFLICT);
    const d = { ...flag, User: { connect: { id: userId } }, target }

    let flagCreated = null
    switch (target) {
      case $Enums.FlagTarget.EVENT: {
        const eventExists = await this.prisma.event.findUnique({ where: { id: targetId } });
        if (!eventExists) throw new HttpException('msg: l\'evenement n\'existe pas', HttpStatus.BAD_REQUEST);
        flagCreated = await this.prisma.flag.create({ data: { ...d, Event: { connect: { id: targetId } } }, include: { Event: true } });
        break;
      }
      case $Enums.FlagTarget.POST: {
        const postExists = await this.prisma.post.findUnique({ where: { id: targetId } });
        if (!postExists) throw new HttpException(`msg: l'annonce ${targetId} n\'existe pas`, HttpStatus.BAD_REQUEST);
        flagCreated = await this.prisma.flag.create({ data: { ...d, Post: { connect: { id: targetId } } }, include: { Post: true } });
        break;
      }
      case $Enums.FlagTarget.SERVICE: {
        const serviceExists = await this.prisma.service.findUnique({ where: { id: targetId } });
        if (!serviceExists) throw new HttpException(`msg: le service ${targetId} n\'existe pas`, HttpStatus.BAD_REQUEST);
        flagCreated = await this.prisma.flag.create({ data: { ...d, Service: { connect: { id: targetId } } }, include: { Service: true } });
        break;
      }
      case $Enums.FlagTarget.SURVEY: {
        const surveyExists = await this.prisma.survey.findUnique({ where: { id: targetId } });
        if (!surveyExists) throw new HttpException(`msg: le sondage ${targetId} n\'existe pas`, HttpStatus.BAD_REQUEST);
        flagCreated = await this.prisma.flag.create({ data: { ...d, Survey: { connect: { id: targetId } } }, include: { Survey: true } });
        break;
      }
      default:
        throw new HttpException('msg: Type de cible non supporté', HttpStatus.BAD_REQUEST);
    }
    ///// FLAG 
    // model Flag {
    //   targetId  Int
    //   userId    Int
    //   target    FlagTarget
    //   reason    FlagReason
    //   createdAt DateTime   @default(now())
    //   updatedAt DateTime   @updatedAt
    //   User      User       @relation(fields: [userId], references: [id], onUpdate: Cascade, onDelete: Cascade)
    //   Post      Post?      @relation(fields: [targetId], references: [id], onUpdate: Cascade, onDelete: Cascade, name: "PostFlag", map: "PostFlag")
    //   Event     Event?     @relation(fields: [targetId], references: [id], onUpdate: Cascade, onDelete: Cascade, name: "EventFlag", map: "EventFlag")
    //   Survey    Survey?    @relation(fields: [targetId], references: [id], onUpdate: Cascade, onDelete: Cascade, name: "SurveyFlag", map: "SurveyFlag")
    //   Service   Service?   @relation(fields: [targetId], references: [id], onUpdate: Cascade, onDelete: Cascade, name: "ServiceFlag", map: "ServiceFlag")

    //   @@id([userId, target, targetId])


    //const flagCreated = await this.prisma.flag.create({ data: data2.data, include: data2.include });
    const flagCount = await this.prisma.flag.count({ where: { targetId, target, reason: flag.reason } });
    if (flagCount >= 3) {
      const deleted = await this.prisma[FlagTarget[target]].delete({ where: { id: targetId }, include: { User: { select: this.select } } });
      const userNotif = new UserNotifInfo(deleted.User)
      const notification: Notification = {
        type: $Enums.NotificationType.FLAG,
        level: $Enums.NotificationLevel.SUB_1,
        title: `Votre ${target.toLowerCase()} a été supprimé`,
        description: `Votre ${target.toLowerCase()} a été supprimé suite à plusieurs signalements, veuillez respecter le réglement du groupe pour éviter de futurs signalements `
      }
      await this.notificationsService.create(userNotif, notification);
    }
    return flagCreated;
  }



  async findAll(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { userId },
      include: {
        Event: { include: { User: { select: { id: true, email: true, Profile: true } } } },
        Post: { include: { User: { select: { id: true, email: true, Profile: true } } } },
        Service: { include: { User: { select: { id: true, email: true, Profile: true } } } },
        Survey: { include: { User: { select: { id: true, email: true, Profile: true } } } },
      }
    });
    return flags.map(flag => {
      switch (flag.target) {
        case $Enums.FlagTarget.EVENT:
          return { ...flag, element: flag.Event, title: flag.Event.title };
        case $Enums.FlagTarget.POST:
          return { ...flag, element: flag.Post, title: flag.Post.title };
        case $Enums.FlagTarget.SERVICE:
          return { ...flag, element: flag.Service, title: flag.Service.title };
        case $Enums.FlagTarget.SURVEY:
          return { ...flag, element: flag.Survey, title: flag.Survey.title }

      }
    }) || [];
  }


  async findAllByTarget(userId: number, target: $Enums.FlagTarget): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Event: true,
      }
    })
    return flags || [];
  }


  async findAllEvent(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.EVENT, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Event: true,
      }
    })
    return flags || [];
  }

  async findAllSurvey(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.SURVEY, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Survey: true,
      }
    })
    return flags || [];
  }


  async findAllPost(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.POST, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Post: true,
      }
    });
    return flags || [];
  }


  async findAllService(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.SERVICE, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Service: true,
      }
    })
    return flags || [];
  }


  async findOne(userId: number, targetId: number, target: $Enums.FlagTarget): Promise<Flag & { element: any, title: string }> {
    const flag = await this.prisma.flag.findUnique({
      where: { userId_target_targetId: { userId, targetId, target } },
      include: {
        Event: { include: { User: { select: { id: true, email: true, Profile: true } } } },
        Survey: { include: { User: { select: { id: true, email: true, Profile: true } } } },
        Post: { include: { User: { select: { id: true, email: true, Profile: true } } } },
        Service: { include: { User: { select: { id: true, email: true, Profile: true } } } },
      }
    });
    if (!flag) throw new HttpException(`msg: le signalement n\'existe pas`, HttpStatus.NO_CONTENT);
    switch (flag.target) {
      case $Enums.FlagTarget.EVENT:
        return { ...flag, element: flag.Event, title: flag.Event.title };
      case $Enums.FlagTarget.POST:
        return { ...flag, element: flag.Post, title: flag.Post.title };
      case $Enums.FlagTarget.SERVICE:
        return { ...flag, element: flag.Service, title: flag.Service.title };
      case $Enums.FlagTarget.SURVEY:
        return { ...flag, element: flag.Survey, title: flag.Survey.title }

    }
  }


  async update(userId: number, targetId: number, target: $Enums.FlagTarget, data: UpdateFlagDto): Promise<Flag> {
    return await this.prisma.flag.update({
      where: { userId_target_targetId: { userId, targetId, target } },
      data: { ...data },
    });
  }

  async remove(userId: number, targetId: number, target: $Enums.FlagTarget): Promise<Flag> {
    return await this.prisma.flag.delete({ where: { userId_target_targetId: { userId, targetId, target } } });
  }
}
