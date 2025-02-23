import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums, Pool, Survey } from '@prisma/client';
import { getDate } from 'middleware/BodyParser';
import { PoolSurveyFilter, PoolSurveyStep } from './entities/constant';

@Injectable()
export class PoolsSurveysService {
  constructor(private prisma: PrismaService) { }

  private poolIncludeConfig(userId?: number) {
    return {
      User: { select: { email: true, Profile: { include: { Address: true } } } },
      Votes: { where: { target: $Enums.VoteTarget.POOL } },
      UserBenef: { select: { id: true, email: true, Profile: true } }
    }
  }
  private surveyIncludeConfig(userId?: number) {
    return {
      User: { select: { email: true, Profile: { include: { Address: true } } } },
      Votes: { where: { target: $Enums.VoteTarget.SURVEY } },
      Flags: { where: { target: $Enums.FlagTarget.SURVEY, userId } }
    }
  }

  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }

  async findAll(userId: number, page?: number, filter?: string, step?: string): Promise<{ poolsSurveys: (Pool | Survey)[], count: number }> {
    if (!step) return { poolsSurveys: [], count: 0 }
    const skip = page ? this.skip(page) : 0;
    let where: any = filter === PoolSurveyFilter.MINE ? { userId } : {}
    let OR = []
    if (step.includes(PoolSurveyStep.NEW)) OR.push({ createdAt: { lt: getDate(0) } })
    if (step.includes(PoolSurveyStep.PENDING)) OR.push({ createdAt: { lt: getDate(7) } })
    if (step.includes(PoolSurveyStep.FINISHED)) {
      const userCount = await this.prisma.user.count()
      OR.push({ createdAt: { lt: getDate(15) } })
    }
    where = { ...where, OR }
    const count = await this.prisma.pool.count({ where }) + await this.prisma.survey.count({ where });
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


}
