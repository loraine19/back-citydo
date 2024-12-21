import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Post } from '@prisma/client';

@Injectable()
export class PostsService {
  // INJECT PRISMA DEV DEPENDENCY
  constructor(private prisma: PrismaService) { }

  async create(data: CreatePostDto): Promise<Post> {
    const { userId, ...post } = data
    return await this.prisma.post.create({ data: { ...post, User: { connect: { id: userId } } } })
  }

  async findAll(): Promise<Post[]> {
    return await this.prisma.post.findMany(
      {
        include: { User: { select: { email: true, Profile: true } }, Like: { include: { User: { select: { email: true, Profile: true, id: true } } } } }
      }
    );
  }


  async findOne(id: number): Promise<Post> {
    return await this.prisma.post.findUniqueOrThrow({
      where: { id },
      include: { User: { select: { email: true, Profile: true, id: true } }, Like: { include: { User: { select: { email: true, Profile: true, id: true } } } } }

    });
  }

  async update(id: number, data: any): Promise<Post> {
    const { userId, ...post } = data
    return await this.prisma.post.update({
      where: { id },
      data: { ...post, User: { connect: { id: userId } } }
    });
  }

  async remove(id: number): Promise<Post> {
    return await this.prisma.post.delete({ where: { id } });
  }
}
