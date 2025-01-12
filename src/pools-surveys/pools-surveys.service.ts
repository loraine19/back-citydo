import { Injectable } from '@nestjs/common';
import { CreatePoolsSurveyDto } from './dto/create-pools-survey.dto';
import { UpdatePoolsSurveyDto } from './dto/update-pools-survey.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums, Pool, Survey } from '@prisma/client';
import { getDate } from 'middleware/BodyParser';

@Injectable()
export class PoolsSurveysService {
  constructor(private prisma: PrismaService) { }
  create(createPoolsSurveyDto: CreatePoolsSurveyDto) { }


  async findAll(userId: number): Promise<(Pool | Survey)[]> {
    const pools = await this.prisma.pool.findMany(
      {
        include: {
          Votes: true,
          User: { select: { id: true, email: true, Profile: true } },
          UserBenef: { select: { id: true, email: true, Profile: true } },
        }, orderBy: { updatedAt: 'desc' }

      }
    )
    const surveys = await this.prisma.survey.findMany({
      include: {
        Votes: true,
        User: { select: { id: true, email: true, Profile: true } },
        Flags: { where: { target: $Enums.FlagTarget.SURVEY, userId } }
      }, orderBy: { updatedAt: 'desc' }

    })
    const poolsSurveys = [...pools, ...surveys]
    return poolsSurveys.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  async findAllByUserId(userId: number): Promise<(Pool | Survey)[]> {
    const pools = await this.prisma.pool.findMany({
      where: { userId },
      include: {
        Votes: true,
        User: { select: { id: true, email: true, Profile: true } },
        UserBenef: { select: { id: true, email: true, Profile: true } }
      }, orderBy: { updatedAt: 'desc' }

    })
    const surveys = await this.prisma.survey.findMany({
      where: { userId },
      include: {
        Votes: true,
        User: { select: { id: true, email: true, Profile: true } },
        Flags: { where: { target: $Enums.FlagTarget.SURVEY, userId } }
      }, orderBy: { updatedAt: 'desc' }

    })
    const poolsSurveys = [...pools.map(p => ({ ...p, type: $Enums.VoteTarget.POOL })), ...surveys.map(s => ({ ...s, type: $Enums.VoteTarget.SURVEY }))]
    return poolsSurveys.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  async findAllNew(userId: number): Promise<(Pool | Survey)[]> {
    const pools = await this.prisma.pool.findMany({
      where: { createdAt: { gt: getDate(7) } },
      include: {
        Votes: true,
        User: { select: { id: true, email: true, Profile: true } },
        UserBenef: { select: { id: true, email: true, Profile: true } }
      }, orderBy: { updatedAt: 'desc' }

    })
    const surveys = await this.prisma.survey.findMany({
      where: { createdAt: { gt: getDate(7) } },
      include: {
        Votes: true,
        User: { select: { id: true, email: true, Profile: true } },
        Flags: {
          where: { target: $Enums.FlagTarget.SURVEY, userId }
        }
      }, orderBy: { updatedAt: 'desc' }

    })
    const poolsSurveys = [...pools.map(p => ({ ...p, type: $Enums.VoteTarget.POOL })), ...surveys.map(s => ({ ...s, type: $Enums.VoteTarget.SURVEY }))]
    return poolsSurveys.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

}
