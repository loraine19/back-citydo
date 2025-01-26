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
        User: { select: { id: true, email: true, Profile: true } },
        Event: true,
        Post: true,
        Service: true,
        Survey: true,
      }
    });
    return flags.map(flag => ({
      ...flag,
      Events: flag.target === $Enums.FlagTarget.EVENT ? flag.Event : undefined,
      Posts: flag.target === $Enums.FlagTarget.POST ? flag.Post : undefined,
      Services: flag.target === $Enums.FlagTarget.SERVICE ? flag.Service : undefined,
      Surveys: flag.target === $Enums.FlagTarget.SURVEY ? flag.Survey : undefined,
    }));
  }

  async findAllByUserId(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Event: { include: { User: { select: { id: true, email: true, Profile: true } } } },
        Post: { include: { User: { select: { id: true, email: true, Profile: true } } } },
        Service: { include: { User: { select: { id: true, email: true, Profile: true } } } },
        Survey: { include: { User: { select: { id: true, email: true, Profile: true } } } },
      }
    });
    if (flags.length === 0) throw new HttpException(`no flags found`, HttpStatus.NO_CONTENT);
    return flags.map(flag => ({
      ...flag,
      Events: flag.target === $Enums.FlagTarget.EVENT ? flag.Event : undefined,
      Posts: flag.target === $Enums.FlagTarget.POST ? flag.Post : undefined,
      Services: flag.target === $Enums.FlagTarget.SERVICE ? flag.Service : undefined,
      Surveys: flag.target === $Enums.FlagTarget.SURVEY ? flag.Survey : undefined,
    }));
  }

  async findAllEvent(): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.EVENT },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Event: true,
      }
    })
    return flags || [];
  }

  async findAllEventByUserId(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.EVENT, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Event: true,
      }
    })
    return flags || [];
  }

  async findAllSurvey(): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.SURVEY },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Survey: true,
      }
    })
    return flags || [];
  }

  async findAllSurveyByUserId(userId: number): Promise<Flag[]> {
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

  async findAllPostByUserId(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.POST, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Post: true,
      }
    });
    return flags || [];
  }


  async findAllServiceByUserId(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.SERVICE, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Service: true,
      }
    })
    return flags || [];
  }


  async findOne(userId: number, targetId: number, target: $Enums.FlagTarget): Promise<Flag> {
    const flag = await this.prisma.flag.findUnique({
      where: { userId_target_targetId: { userId, targetId, target } },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Event: { include: { User: { select: { id: true, email: true, Profile: true } } } },
        Survey: { include: { User: { select: { id: true, email: true, Profile: true } } } },
        Post: { include: { User: { select: { id: true, email: true, Profile: true } } } },
        Service: { include: { User: { select: { id: true, email: true, Profile: true } } } },
      }
    });
    if (!flag) throw new HttpException(`no flag found`, HttpStatus.NO_CONTENT);
    flag.Event = flag.target === $Enums.FlagTarget.EVENT ? flag.Event : undefined;
    flag.Survey = flag.target === $Enums.FlagTarget.SURVEY ? flag.Survey : undefined;
    flag.Post = flag.target === $Enums.FlagTarget.POST ? flag.Post : undefined;
    flag.Service = flag.target === $Enums.FlagTarget.SERVICE ? flag.Service : undefined;
    return flag
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
