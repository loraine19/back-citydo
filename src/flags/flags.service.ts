import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFlagDto } from './dto/create-flag.dto';
import { UpdateFlagDto } from './dto/update-flag.dto';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Flag, User } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';
import { ActionType } from 'src/mailer/constant';

@Injectable()
export class FlagsService {
  constructor(private prisma: PrismaService, private mailer: MailerService) { }

  async create(data: CreateFlagDto): Promise<Flag> {
    const { userId, targetId, ...flag } = data;
    const flagCreated = await this.prisma.flag.create({
      data: {
        ...flag,
        User: { connect: { id: userId } },
        [flag.target.toLowerCase()]: { connect: { id: targetId } },
      },
      include: {
        Event: { include: { User: true } },
        Post: { include: { User: true } },
        Service: { include: { User: true } },
        Survey: { include: { User: true } }
      }
    });
    const flagCount = await this.prisma.flag.count({ where: { targetId, target: flag.target, reason: flag.reason } });
    if (flagCount >= 3) {
      const user = flagCreated[flag.target].User;
      await this.prisma[flag.target.toLowerCase()].delete({ where: { id: targetId } });
      await this.mailer.sendNotificationEmail(
        [user.email],
        `Votre ${flag.target.toLowerCase()} a été supprimé`,
        targetId,
        flag.target.toLowerCase(),
        ActionType.DELETE,
        `Votre ${flagCreated[flag.target].title} a été supprimé pour cause de ${flag.reason}`
      );
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
    if (!flag) throw new HttpException(`no flag found`, HttpStatus.NO_CONTENT);
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
