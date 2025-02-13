import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFlagDto } from './dto/create-flag.dto';
import { UpdateFlagDto } from './dto/update-flag.dto';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Flag } from '@prisma/client';

@Injectable()
export class FlagsService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateFlagDto): Promise<Flag> {
    const { userId, targetId, ...flag } = data;
    return await this.prisma.flag.create({
      data: {
        ...flag,
        User: { connect: { id: userId } },
        Survey: flag.target === $Enums.FlagTarget.SURVEY ? { connect: { id: targetId } } : undefined,
        Event: flag.target === $Enums.FlagTarget.EVENT ? { connect: { id: targetId } } : undefined,
        Post: flag.target === $Enums.FlagTarget.POST ? { connect: { id: targetId } } : undefined,
        Service: flag.target === $Enums.FlagTarget.SERVICE ? { connect: { id: targetId } } : undefined,
      },
    });
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
    const flags2 = flags.map(flag => {
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
    console.log(flags2)
    return flags2;
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
