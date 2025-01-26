import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Like } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { LikeEntity, LikeWithUser } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateLikeDto): Promise<LikeWithUser> {
    const { userId, postId } = data;
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, Profile: true } });
    const like = await this.prisma.like.create({
      data: {
        User: { connect: { id: userId } },
        Post: { connect: { id: postId } },
      },
    });
    return { ...like, User: user }
  }


  async remove(userId: number, postId: number): Promise<Like> {
    return await this.prisma.like.delete({ where: { userId_postId: { userId, postId } } });
  }
}