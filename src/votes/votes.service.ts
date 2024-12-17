import { Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums, Vote } from '@prisma/client';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateVoteDto): Promise<Vote> {
    const { userId, ...vote } = data;
    return await this.prisma.vote.create({
      data: {
        ...vote,
        User: { connect: { id: userId } },

      },
    });
  }

  async findAll(): Promise<Vote[]> {
    return await this.prisma.vote.findMany(

    );
  }

  async findOne(userId: number, targetId: number, target: $Enums.VoteTarget): Promise<Vote> {
    return await this.prisma.vote.findUniqueOrThrow({
      where: { userId_target_targetId: { userId, targetId, target } }
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