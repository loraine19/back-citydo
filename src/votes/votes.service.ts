import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Vote } from '@prisma/client';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateVoteDto): Promise<Vote> {
    const { userId, targetId, ...vote } = data;
    return await this.prisma.vote.create({
      data: {
        ...vote,
        User: { connect: { id: userId } },
        Pools: vote.target === $Enums.VoteTarget.POOL && { connect: { id: targetId } },
        Surveys: vote.target === $Enums.VoteTarget.SURVEY && { connect: { id: targetId } },
      },
    });
  }


  async findAll(): Promise<Vote[]> {
    const votes = await this.prisma.vote.findMany({
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Pools: true,
        Surveys: true,
      }
    });
    return votes.map(vote => ({
      ...vote,
      Pools: vote.target === $Enums.VoteTarget.POOL ? vote.Pools : undefined,
      Surveys: vote.target === $Enums.VoteTarget.SURVEY ? vote.Surveys : undefined,
    }));
  }



  async findAllByUserId(userId: number): Promise<Vote[]> {
    const votes = await this.prisma.vote.findMany({
      where: { userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Pools: true,
        Surveys: true,
      }
    });
    if (votes.length === 0) throw new HttpException(`no votes found`, HttpStatus.NO_CONTENT);
    return votes.map(vote => ({
      ...vote,
      Pools: vote.target === $Enums.VoteTarget.POOL ? vote.Pools : undefined,
      Surveys: vote.target === $Enums.VoteTarget.SURVEY ? vote.Surveys : undefined,
    }));
  }
  async findAllPool(): Promise<Vote[]> {
    const votes = await this.prisma.vote.findMany({
      where: { target: $Enums.VoteTarget.POOL },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Pools: true,
      }
    });
    if (!votes) throw new HttpException(`no votes found`, HttpStatus.NO_CONTENT);
    return votes
  }

  async findAllPoolByUserId(userId: number): Promise<Vote[]> {
    const votes = await this.prisma.vote.findMany({
      where: { target: $Enums.VoteTarget.POOL, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Pools: true,
      }
    });
    if (!votes || votes.length === 0) throw new HttpException(`no votes found`, HttpStatus.NO_CONTENT);
    return votes
  }

  async findAllSurvey(): Promise<Vote[]> {
    const votes = await this.prisma.vote.findMany({
      where: { target: $Enums.VoteTarget.SURVEY },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Surveys: true,
      }
    });
    if (!votes) throw new HttpException(`no votes found`, HttpStatus.NO_CONTENT);
    return votes
  }

  async findAllSurveyByUserId(userId: number): Promise<Vote[]> {

    const votes = await this.prisma.vote.findMany({
      where: { target: $Enums.VoteTarget.SURVEY, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Surveys: true,
      }
    });
    if (!votes) throw new HttpException(`no votes found`, HttpStatus.NO_CONTENT);
    return votes
  }


  async findOne(userId: number, targetId: number, target: $Enums.VoteTarget): Promise<Vote> {
    const vote = await this.prisma.vote.findUnique({
      where: { userId_target_targetId: { userId, targetId, target } },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Pools: true,
        Surveys: true,
      }
    })
    vote.Pools = vote.target === $Enums.VoteTarget.POOL ? vote.Pools : undefined;
    vote.Surveys = vote.target === $Enums.VoteTarget.SURVEY ? vote.Surveys : undefined;
    return vote;
  }



  async findOneByUserId(userId: number): Promise<Vote[]> {
    const votes = await this.prisma.vote.findMany({
      where: { userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Pools: true,
        Surveys: true,
      }
    });
    if (!votes || votes.length === 0) throw new HttpException(`no votes found`, HttpStatus.NO_CONTENT);
    return votes.map(vote => ({
      ...vote,
      Pools: vote.target === $Enums.VoteTarget.POOL ? vote.Pools : undefined,
      Surveys: vote.target === $Enums.VoteTarget.SURVEY ? vote.Surveys : undefined,
    }));
  }

  async update(userId: number, targetId: number, target: $Enums.VoteTarget, data: UpdateVoteDto): Promise<Vote> {
    return await this.prisma.vote.update({
      where: { userId_target_targetId: { userId, targetId, target } },
      data: { ...data },
    });
  }

  async remove(userId: number, targetId: number, target: $Enums.VoteTarget,): Promise<Vote> {
    return await this.prisma.vote.delete({ where: { userId_target_targetId: { userId, targetId, target } }, });
  }
}