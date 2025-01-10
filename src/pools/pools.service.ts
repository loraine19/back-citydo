import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { $Enums, Pool } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoolsService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreatePoolDto): Promise<Pool> {
    const { userId, userIdBenef, ...pool } = data;
    return await this.prisma.pool.create({
      data: {
        User: { connect: { id: userId } },
        UserBenef: { connect: { id: userIdBenef } },
        ...pool,
      },
    });
  }


  async findAll(): Promise<Pool[]> {
    const pools = await this.prisma.pool.findMany({
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        UserBenef: { select: { id: true, email: true, Profile: true } },
        Votes: { include: { User: { select: { id: true, email: true, Profile: true } } }, where: { target: $Enums.VoteTarget.POOL } }
      }
    }
    );
    if (pools.length === 0) throw new HttpException('No surveys found', HttpStatus.NO_CONTENT)

    return pools
  }

  async findAllByUserId(userId: number): Promise<Pool[]> {
    const pools = await this.prisma.pool.findMany({
      where: { userId },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        UserBenef: { select: { id: true, email: true, Profile: true } },
        Votes: { select: { User: { select: { id: true, email: true, Profile: true } } }, where: { target: $Enums.VoteTarget.POOL } }
      }
    })
    if (pools.length === 0) throw new HttpException('No surveys found', HttpStatus.NO_CONTENT)
    return pools
  }

  async findOne(id: number): Promise<Pool> {
    return await this.prisma.pool.findUniqueOrThrow({
      where: { id }, include: {
        User: { select: { id: true, email: true, Profile: true } },
        UserBenef: { select: { id: true, email: true, Profile: true } },
        Votes: { select: { User: { select: { id: true, email: true, Profile: true } } }, where: { target: $Enums.VoteTarget.POOL } }
      }

    });
  }

  async update(id: number, data: UpdatePoolDto): Promise<Pool> {
    const { userId, userIdBenef, ...pool } = data;
    return await this.prisma.pool.update({
      where: { id },
      data: {
        User: { connect: { id: userId } },
        UserBenef: { connect: { id: userIdBenef } },
        ...pool,
      }
    });
  }

  async remove(id: number): Promise<Pool> {
    return await this.prisma.pool.delete({ where: { id } });
  }
}