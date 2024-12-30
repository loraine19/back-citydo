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
        Surveys: flag.target === $Enums.FlagTarget.SURVEY ? { connect: { id: targetId } } : undefined,
        Events: flag.target === $Enums.FlagTarget.EVENT ? { connect: { id: targetId } } : undefined,
        Posts: flag.target === $Enums.FlagTarget.POST ? { connect: { id: targetId } } : undefined,
        Services: flag.target === $Enums.FlagTarget.SERVICE ? { connect: { id: targetId } } : undefined,
      },
    });
  }

  async findAll(): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Events: true,
        Posts: true,
        Services: true,
        Surveys: true,
      }
    });
    return flags.map(flag => ({
      ...flag,
      Events: flag.target === $Enums.FlagTarget.EVENT ? flag.Events : undefined,
      Posts: flag.target === $Enums.FlagTarget.POST ? flag.Posts : undefined,
      Services: flag.target === $Enums.FlagTarget.SERVICE ? flag.Services : undefined,
      Surveys: flag.target === $Enums.FlagTarget.SURVEY ? flag.Surveys : undefined,
    }));
  }

  async findAllByUserId(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Events: true,
        Posts: true,
        Services: true,
        Surveys: true,
      }
    });
    if (flags.length === 0) throw new HttpException(`no flags found`, HttpStatus.NO_CONTENT);
    return flags.map(flag => ({
      ...flag,
      Events: flag.target === $Enums.FlagTarget.EVENT ? flag.Events : undefined,
      Posts: flag.target === $Enums.FlagTarget.POST ? flag.Posts : undefined,
      Services: flag.target === $Enums.FlagTarget.SERVICE ? flag.Services : undefined,
      Surveys: flag.target === $Enums.FlagTarget.SURVEY ? flag.Surveys : undefined,
    }));
  }

  async findAllEvent(): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.EVENT },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Events: true,
      }
    });
    if (!flags) throw new HttpException(`no flags found`, HttpStatus.NO_CONTENT);
    return flags;
  }

  async findAllEventByUserId(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.EVENT, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Events: true,
      }
    });
    if (!flags || flags.length === 0) throw new HttpException(`no flags found`, HttpStatus.NO_CONTENT);
    return flags;
  }

  async findAllSurvey(): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.SURVEY },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Surveys: true,
      }
    });
    if (!flags) throw new HttpException(`no flags found`, HttpStatus.NO_CONTENT);
    return flags;
  }

  async findAllSurveyByUserId(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.SURVEY, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Surveys: true,
      }
    });
    if (!flags) throw new HttpException(`no flags found`, HttpStatus.NO_CONTENT);
    return flags;
  }

  async findAllPost(): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.POST },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Posts: true,
      }
    });
    if (!flags) throw new HttpException(`no flags found`, HttpStatus.NO_CONTENT);
    return flags;
  }

  async findAllPostByUserId(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.POST, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Posts: true,
      }
    });
    if (!flags) throw new HttpException(`no flags found`, HttpStatus.NO_CONTENT);
    return flags;
  }


  async findAllService(): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.SERVICE },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Services: true,
      }
    });
    if (!flags) throw new HttpException(`no flags found`, HttpStatus.NO_CONTENT);
    return flags;
  }

  async findAllServiceByUserId(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { target: $Enums.FlagTarget.SERVICE, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Services: true,
      }
    });
    if (!flags) throw new HttpException(`no flags found`, HttpStatus.NO_CONTENT);
    return flags;
  }









  async findOne(userId: number, targetId: number, target: $Enums.FlagTarget): Promise<Flag> {
    const flag = await this.prisma.flag.findUnique({
      where: { userId_target_targetId: { userId, targetId, target } },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Events: true,
        Surveys: true,
        Posts: true,
        Services: true
      }
    });
    if (!flag) throw new HttpException(`no flag found`, HttpStatus.NO_CONTENT);
    flag.Events = flag.target === $Enums.FlagTarget.EVENT ? flag.Events : undefined;
    flag.Surveys = flag.target === $Enums.FlagTarget.SURVEY ? flag.Surveys : undefined;
    flag.Posts = flag.target === $Enums.FlagTarget.POST ? flag.Posts : undefined;
    flag.Services = flag.target === $Enums.FlagTarget.SERVICE ? flag.Services : undefined;
    return flag;
  }

  async findOneByUserId(userId: number): Promise<Flag[]> {
    const flags = await this.prisma.flag.findMany({
      where: { userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Events: true,
        Surveys: true,
        Posts: true,
        Services: true
      }
    });
    if (!flags || flags.length === 0) throw new HttpException(`no flags found`, HttpStatus.NO_CONTENT);
    return flags.map(flag => ({
      ...flag,
      Events: flag.target === $Enums.FlagTarget.EVENT ? flag.Events : undefined,
      Surveys: flag.target === $Enums.FlagTarget.SURVEY ? flag.Surveys : undefined,
      Posts: flag.target === $Enums.FlagTarget.POST ? flag.Posts : undefined,
      Services: flag.target === $Enums.FlagTarget.SERVICE ? flag.Services : undefined,
    }));
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
