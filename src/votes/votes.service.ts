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
        Pool: vote.target === $Enums.VoteTarget.POOL && { connect: { id: targetId } },
        Survey: vote.target === $Enums.VoteTarget.SURVEY && { connect: { id: targetId } },
      },
    });
  }

  async findAll(): Promise<Vote[]> {
    return await this.prisma.vote.findMany({
      include: {
        User: { select: { id: true, email: true, Profile: true } },
      }
    });
  }

  async findAllByUserId(userId: number): Promise<Vote[]> {
    const votes = await this.prisma.vote.findMany({
      where: { userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
      }
    });
    if (votes.length === 0) throw new HttpException(`no votes found`, HttpStatus.NO_CONTENT);
    return votes
  }

  async findAllPool(): Promise<Vote[]> {
    const votes = await this.prisma.vote.findMany({
      where: { target: $Enums.VoteTarget.POOL },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Pool: true,
      }
    });
    if (!votes || votes.length === 0) throw new HttpException(`no votes found`, HttpStatus.NO_CONTENT);
    return votes
  }

  async findAllPoolByUserId(userId: number): Promise<Vote[]> {
    const votes = await this.prisma.vote.findMany({
      where: { target: $Enums.VoteTarget.POOL, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Pool: true,
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
        Survey: true,
      }
    });
    if (!votes || votes.length === 0) throw new HttpException(`no votes found`, HttpStatus.NO_CONTENT);
    return votes
  }

  async findAllSurveyByUserId(userId: number): Promise<Vote[]> {

    const votes = await this.prisma.vote.findMany({
      where: { target: $Enums.VoteTarget.SURVEY, userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Survey: true,
      }
    });
    if (!votes || votes.length === 0) throw new HttpException(`no votes found`, HttpStatus.NO_CONTENT);
    return votes
  }


  async findOne(userId: number, targetId: number, target: $Enums.VoteTarget): Promise<Vote> {
    return await this.prisma.vote.findUniqueOrThrow({
      where: { userId_target_targetId: { userId, targetId, target } },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Pool: true,
        Survey: true,
      }
    });
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