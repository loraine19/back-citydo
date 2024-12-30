import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Like } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateLikeDto): Promise<Like> {
    const { userId, postId } = data;
    return await this.prisma.like.create({
      data: {
        User: { connect: { id: userId } },
        Post: { connect: { id: postId } },
      },
    });
  }

  async findAll(): Promise<Like[]> {
    return await this.prisma.like.findMany(
    );
  }

  async findAllByUserId(userId: number): Promise<Like[]> {
    const likes = await this.prisma.like.findMany({ where: { userId } })
    if (!likes.length) throw new HttpException(`no likes found`, HttpStatus.NO_CONTENT);
    return likes
  }

  async findOne(userId: number, postId: number): Promise<Like> {
    return await this.prisma.like.findUniqueOrThrow({
      where: { userId_postId: { userId, postId } }
    });
  }



  async update(userId: number, postId: number, updatePartcicipantDto: UpdateLikeDto): Promise<Like> {
    return await this.prisma.like.update({
      where: { userId_postId: { userId, postId } },
      data: updatePartcicipantDto,
    });
  }

  async remove(userId: number, postId: number): Promise<Like> {
    return await this.prisma.like.delete({ where: { userId_postId: { userId, postId } } });
  }
}