import { Injectable } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { $Enums, Survey } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurveyWithVote } from './entities/survey.entity';


@Injectable()
export class SurveysService {
  constructor(private prisma: PrismaService) { }


  async create(data: CreateSurveyDto): Promise<Survey> {
    const { userId, ...survey } = data
    return await this.prisma.survey.create({ data: { ...survey, User: { connect: { id: userId } } } })
  }

  async findAll(): Promise<Survey[]> {
    return this.prisma.survey.findMany(
      { include: { User: true } }
    );
  }



  async findSome(userId: number): Promise<Survey[]> {
    return await this.prisma.survey.findMany(
      { where: { User: { is: { id: userId } } } }
    )
  }

  async findOneWithVote(id: number): Promise<SurveyWithVote> {
    const survey = await this.prisma.survey.findUniqueOrThrow({
      where: { id },
      include: { User: true }
    });
    const suruveyWithVote = {
      ...survey, votes: await this.prisma.vote.findMany({
        where: {
          target: $Enums.VoteTarget.SURVEY,
          targetId: id
        }
      })
    }
    return suruveyWithVote
  }


  async findOne(id: number): Promise<Survey> {
    return await this.prisma.survey.findUniqueOrThrow({
      where: { id },
      include: { User: true }
    });
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
