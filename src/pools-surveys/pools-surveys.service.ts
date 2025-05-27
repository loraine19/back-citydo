import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums, Pool, Survey } from '@prisma/client';
import { getDate } from 'middleware/BodyParser';
import { PoolSurveyFilter, PoolSurveyStep } from './entities/constant';
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
  private groupSelectConfig = (userId: number) => ({ GroupUser: { some: { userId } } })

  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }

  async findAll(userId: number, page?: number, filter?: string, step?: string): Promise<{ poolsSurveys: (Pool | Survey)[], count: number }> {
    if (!step) return { poolsSurveys: [], count: 0 }
    const skip = page ? this.skip(page) : 0;
    let where: any = filter === PoolSurveyFilter.MINE ? { userId } : { Group: this.groupSelectConfig(userId) }
    let OR = []
    if (step.includes(PoolSurveyStep.NEW)) OR.push({ createdAt: { lt: getDate(0) } })
    if (step.includes(PoolSurveyStep.PENDING)) OR.push({ createdAt: { lt: getDate(7) } })
    if (step.includes(PoolSurveyStep.VALIDATED)) OR.push({ status: $Enums.PoolSurveyStatus.VALIDATED })
    if (step.includes(PoolSurveyStep.REJECTED)) OR.push({ status: $Enums.PoolSurveyStatus.REJECTED })
    where = { ...where, OR }

    const count = filter === PoolSurveyFilter.SURVEY ? await this.prisma.survey.count({ where }) :
      filter === PoolSurveyFilter.POOL ? await this.prisma.pool.count({ where }) : await this.prisma.pool.count({ where }) + await this.prisma.survey.count({ where })
    const take = page ? this.limit : count;
    const pools = filter === PoolSurveyFilter.SURVEY ? [] : await this.prisma.pool.findMany(
      {
        include: this.poolIncludeConfig(userId),
        skip,
        take,
        where
      }
    )
    const surveys = filter === PoolSurveyFilter.POOL ? [] : await this.prisma.survey.findMany({
      include: this.surveyIncludeConfig(userId),
      skip,
      take,
      where
    })
    const poolsSurveys: (Pool | Survey)[] = [...pools, ...surveys]
    poolsSurveys.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
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
