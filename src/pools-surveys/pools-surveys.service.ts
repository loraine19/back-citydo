import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums, Pool, Prisma, Survey, VoteOpinion } from '@prisma/client';
import { getDate } from 'middleware/BodyParser';
import { PoolSurveyFilter, PoolSurveySort, PoolSurveyStep } from './entities/constant';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class PoolsSurveysService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) { }

  private poolIncludeConfig(userId?: number) {
    return {
      User: { select: { email: true, Profile: { include: { Address: true } } } },
      Votes: { where: { target: $Enums.VoteTarget.POOL } },
      UserBenef: { select: { id: true, GroupUser: { include: { Group: { select: { name: true, id: true } } } }, email: true, Profile: { include: { Address: true } } } },
      Group: { include: { GroupUser: true, Address: true } }
    }
  }

  private surveyIncludeConfig(userId?: number) {
    return {
      User: { select: { email: true, Profile: { include: { Address: true } } } },
      Votes: { where: { target: $Enums.VoteTarget.SURVEY } },
      Flags: { where: { target: $Enums.FlagTarget.SURVEY, userId } },
      Group: { include: { GroupUser: true, Address: true } }
    }
  }

  private userSelectConfig = {
    id: true,
    email: true,
    Profile: { select: { mailSub: true } }
  }


  private sortBy = (sort: PoolSurveySort, reverse?: boolean): Prisma.PoolOrderByWithRelationInput => {
    switch (sort) {
      case PoolSurveySort.TITLE:
        return reverse ? { title: 'desc' } : { title: 'asc' };
      case PoolSurveySort.CREATED_AT:
        return reverse ? { createdAt: 'desc' } : { createdAt: 'asc' };
      case PoolSurveySort.USER:
        return reverse ? { User: { Profile: { firstName: 'desc' } } } : { User: { Profile: { firstName: 'asc' } } };
      case PoolSurveySort.VOTES:
        return reverse ? { Votes: { _count: 'asc' } } : { Votes: { _count: 'desc' } };
      default:
        return reverse ? { createdAt: 'desc' } : { createdAt: 'asc' }
    }
  }

  private groupSelectConfig = (userId: number) => ({ GroupUser: { some: { userId } } })

  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }

  async findAll(userId: number, page?: number, filter?: string, step?: string, sort?: PoolSurveySort, reverse?: boolean): Promise<{ poolsSurveys: (Pool | Survey)[], count: number }> {
    if (!step) return { poolsSurveys: [], count: 0 }
    const skip = page ? this.skip(page) : 0;
    const orderBy = this.sortBy(sort, reverse)
    let OR = []
    if (step.includes(PoolSurveyStep.NEW)) OR.push({ createdAt: { lt: getDate(0) } })
    if (step.includes(PoolSurveyStep.PENDING)) OR.push({ createdAt: { lt: getDate(7) } })
    if (step.includes(PoolSurveyStep.VALIDATED)) OR.push({ status: $Enums.PoolSurveyStatus.VALIDATED })
    if (step.includes(PoolSurveyStep.REJECTED)) OR.push({ status: $Enums.PoolSurveyStatus.REJECTED })
    const Group = this.groupSelectConfig(userId)
    let where: any = { OR, Group }
    if (filter === PoolSurveyFilter.MINE) {
      where = {
        ...where,
        User: { id: userId }
      }
    }
    let count = 0;
    switch (filter) {
      case PoolSurveyFilter.SURVEY:
        count = await this.prisma.survey.count({ where });
        break;
      case PoolSurveyFilter.POOL:
        count = await this.prisma.pool.count({ where });
        break;
      default:
        count = await this.prisma.pool.count({ where }) + await this.prisma.survey.count({ where });
    }

    const take = page ? this.limit : count;
    const pools = filter === PoolSurveyFilter.SURVEY ? [] : await this.prisma.pool.findMany(
      {
        include: this.poolIncludeConfig(userId),
        skip,
        take,
        where,
        orderBy
      }
    )
    const surveys = filter === PoolSurveyFilter.POOL ? [] : await this.prisma.survey.findMany({
      include: this.surveyIncludeConfig(userId),
      skip,
      take,
      where,
      orderBy
    })
    let poolsSurveys: (any)[] =
      filter === PoolSurveyFilter.SURVEY ? surveys : filter === PoolSurveyFilter.POOL ? pools :
        [...pools, ...surveys]

    switch (filter) {
      case PoolSurveyFilter.SURVEY:
        poolsSurveys = surveys
        break;
      case PoolSurveyFilter.POOL:
        poolsSurveys = pools
        break;
      default:
        poolsSurveys = [...pools, ...surveys]
        switch (sort) {
          case PoolSurveySort.CREATED_AT:
            !reverse ? poolsSurveys.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) :
              poolsSurveys.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case PoolSurveySort.TITLE:
            !reverse ? poolsSurveys.sort((a, b) => a.title.localeCompare(b.title)) :
              poolsSurveys.sort((a, b) => b.title.localeCompare(a.title));
            break;
          case PoolSurveySort.USER:
            !reverse ? poolsSurveys.sort((a, b) => a.User.Profile.firstName.localeCompare(b.User.Profile.firstName)) :
              poolsSurveys.sort((a, b) => b.User.Profile.firstName.localeCompare(a.User.Profile.firstName));
            break;
          case PoolSurveySort.VOTES:
            reverse ? poolsSurveys.sort((a: any, b: any) => (b.Votes?.filter(v => v.opinion === VoteOpinion.OK).length - (a.Votes?.filter(v => v.opinion === VoteOpinion.OK)?.length ?? 0))) :
              poolsSurveys.sort((a: any, b: any) => (a.Votes?.filter(v => v.opinion === VoteOpinion.OK).length ?? 0) - (b.Votes?.filter(v => v.opinion === VoteOpinion.OK).length ?? 0));
            break;
          default:
            poolsSurveys.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }
    return { poolsSurveys, count }
  }

  ////POOLS 
  async findOnePool(id: number, userId: number): Promise<Pool> {
    return await this.prisma.pool.findUniqueOrThrow({
      where: { id, Group: this.groupSelectConfig(userId) },
      include: this.poolIncludeConfig(userId)
    })
  }

  async createPool(data: CreatePoolDto): Promise<Pool> {
    const { userId, userIdBenef, groupId, ...pool } = data;
    const count = await this.prisma.user.count({ where: { GroupUser: { some: { groupId } } } })
    const neededVotes = Math.ceil(count / 2)
    const users = await this.prisma.user.findMany({ select: this.userSelectConfig })
    const poolCreated = await this.prisma.pool.create({
      data: {
        User: { connect: { id: userId } },
        UserBenef: { connect: { id: userIdBenef } },
        Group: { connect: { id: groupId } },
        neededVotes,
        ...pool,
      },
      include: this.poolIncludeConfig(userId)
    })
    const notification = {
      title: 'Nouvelle cagnotte',
      description: `${poolCreated.title} a été créée , votez pour valider cette cagnotte `,
      type: $Enums.NotificationType.SURVEY,
      level: $Enums.NotificationLevel.SUB_4,
      link: `/cagnotte/${poolCreated.id}`
    }
    await this.notificationsService.createMany(users, notification)
    return poolCreated
  }

  async updatePool(id: number, data: UpdatePoolDto): Promise<Pool> {
    const { userId, userIdBenef, groupId, ...pool } = data;
    return await this.prisma.pool.update({
      where: { id },
      include: this.poolIncludeConfig(userId),
      data: {
        User: { connect: { id: userId } },
        UserBenef: { connect: { id: userIdBenef } },
        Group: { connect: { id: groupId } },
        ...pool,
      },
    })
  }

  async removePool(id: number, userId: number): Promise<Pool> {
    const pool = await this.prisma.pool.delete({
      where: { id, userId }
    })
    if (pool.userId !== userId) throw new HttpException('Vous n\'êtes pas autorisé à supprimer cette cagnotte', 403)
    return pool
  }



  ////SURVEYS
  async findOneSurvey(id: number, userId: number): Promise<Survey> {
    return await this.prisma.survey.findUniqueOrThrow({
      where: { id, Group: this.groupSelectConfig(userId) },
      include: this.surveyIncludeConfig(userId)
    });
  }

  async createSurvey(data: CreateSurveyDto): Promise<Survey> {
    const { userId, groupId, ...survey } = data;
    const count = await this.prisma.user.count({ where: { GroupUser: { some: { groupId } } } })
    const neededVotes = Math.ceil(count / 2)
    const users = await this.prisma.user.findMany({ select: this.userSelectConfig })
    const surveyCreated = await this.prisma.survey.create(
      {
        include: this.surveyIncludeConfig(userId),
        data: {
          ...survey,
          User: { connect: { id: userId } },
          Group: { connect: { id: groupId } },
          neededVotes
        }
      })
    const notification = {
      title: 'Nouvelle enquête',
      description: `${surveyCreated.title} a été créée, votez pour valider cette descision du groupe`,
      type: $Enums.NotificationType.SURVEY,
      level: $Enums.NotificationLevel.SUB_4,
      link: `/sondage/${surveyCreated.id}`
    }
    await this.notificationsService.createMany(users, notification)
    return surveyCreated
  }

  async updateSurvey(id: number, data: any): Promise<Survey> {
    const { userId, userIdResp, groupId, ...service } = data
    return await this.prisma.survey.update({
      where: { id, userId },
      include: this.surveyIncludeConfig(userId),
      data: {
        ...service,
        User: { connect: { id: userId } },
        Group: { connect: { id: groupId } }
      }
    });
  }

  async removeSurvey(id: number, userId: number): Promise<Survey> {
    const survey = await this.prisma.survey.findUniqueOrThrow({ where: { id, userId } })
    if (survey.userId !== userId) throw new HttpException('Vous n\'êtes pas autorisé à supprimer cette enquête', 403)
    survey.image && ImageInterceptor.deleteImage(survey.image)
    return await this.prisma.survey.delete({ where: { id } });
  }

}
