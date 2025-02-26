import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Vote } from '@prisma/client';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateVoteDto): Promise<Vote> {
    const { targetId, target, userId, opinion } = data
    if (target === $Enums.VoteTarget.POOL) {
      return await this.prisma.vote.create({
        data: { opinion, target, Pool: { connect: { id: targetId } }, User: { connect: { id: userId } } }

      })
    }
    if (target === $Enums.VoteTarget.SURVEY) {
      return await this.prisma.vote.create({
        data: { opinion, target, Survey: { connect: { id: targetId } }, User: { connect: { id: userId } } }
      })
    }

  }



  async update(userId: number, data: UpdateVoteDto): Promise<Vote> {
    const { targetId, target } = data
    const vote = await this.prisma.vote.findUnique({ where: { userId_target_targetId: { userId, targetId: data.targetId, target: data.target } } });
    if (!vote) throw new HttpException('Votre vote n\'existe pas', 404)
    if (vote.userId !== userId) throw new HttpException('Vous ne pouvez pas modifier ce vote', 403)
    return await this.prisma.vote.update({
      where: { userId_target_targetId: { userId, targetId, target } },
      data: { ...data },
    });
  }

  async remove(userId: number, targetId: number, target: $Enums.VoteTarget,): Promise<Vote> {
    return await this.prisma.vote.delete({ where: { userId_target_targetId: { userId, targetId, target } }, });
  }
}