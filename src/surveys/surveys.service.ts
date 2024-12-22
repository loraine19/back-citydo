import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { $Enums, Survey } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SurveyWithVote } from './entities/survey.entity';


@Injectable()
export class SurveysService {
  constructor(private prisma: PrismaService) { }


  async create(data: CreateSurveyDto): Promise<Survey> {
    const { userId, ...survey } = data
    return await this.prisma.survey.create({ data: { ...survey, User: { connect: { id: userId } } } })
  }

  async findAll(): Promise<Survey[]> {
    const surveys = await this.prisma.survey.findMany({
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Vote: { select: { User: { select: { id: true, email: true, Profile: true } } }, where: { target: $Enums.VoteTarget.SURVEY } }
      }
    })
    return surveys
  }

  async findAllByUserId(userId: number): Promise<Survey[]> {
    const surveys = await this.prisma.survey.findMany(
      {
        where: { User: { is: { id: userId } } },
        include: {
          User: { select: { id: true, email: true, Profile: true } },
          Vote: { select: { User: { select: { id: true, email: true, Profile: true } } }, where: { target: $Enums.VoteTarget.SURVEY } }
        }
      })
    return surveys
  }

  async findOne(id: number): Promise<Survey> {
    const survey = await this.prisma.survey.findUniqueOrThrow({
      where: { id },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Vote: { select: { User: { select: { id: true, email: true, Profile: true } } }, where: { target: $Enums.VoteTarget.SURVEY } }
      }
    })
    return survey
  }

  async update(id: number, data: any): Promise<Survey> {
    const { userId, userIdResp, ...service } = data
    return await this.prisma.survey.update({
      where: { id },
      data: { ...service, User: { connect: { id: userId } }, UserResp: { connect: { id: userIdResp } } }
    });
  }

  async remove(id: number): Promise<Survey> {
    return await this.prisma.survey.delete({ where: { id } });
  }
}
