import { Injectable } from '@nestjs/common';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { Pool } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
    return await this.prisma.pool.findMany(
      {
        include: {
          User: true,
          UserBenef: true,
        }
      }
    );
  }

  async findOne(id: number): Promise<Pool> {
    return await this.prisma.pool.findUniqueOrThrow({
      where: { id }, include: { User: true, UserBenef: true }
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