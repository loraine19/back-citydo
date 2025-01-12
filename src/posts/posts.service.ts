import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { $Enums, Post } from '@prisma/client';
import { ImageInterceptor } from 'middleware/ImageInterceptor';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreatePostDto): Promise<Post> {
    const { userId, ...post } = data
    return await this.prisma.post.create({ data: { ...post, User: { connect: { id: userId } } } })
  }

  async findAll(userId: number): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      include: {
        User: { select: { email: true, Profile: { include: { Address: true } } } },
        Likes: { include: { User: { select: { email: true, Profile: true, id: true } } } },
        Flags: { where: { target: $Enums.FlagTarget.POST, userId } }
      },
      orderBy: { Likes: { _count: 'desc' } }
    });
    return posts
  }


  async findOne(id: number, userId: number): Promise<Post> {
    return await this.prisma.post.findUniqueOrThrow({
      where: { id },
      include: {
        User: { select: { email: true, Profile: { include: { Address: true } }, id: true } },
        Likes: { include: { User: { select: { email: true, Profile: true, id: true } } } },
        Flags: { where: { target: $Enums.FlagTarget.POST, userId } }
      }

    });
  }

  async findAllByUserId(userId: number): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: { userId },
      include: { User: { select: { email: true, Profile: true, id: true } }, Likes: { include: { User: { select: { email: true, Profile: true, id: true } } } } },
      orderBy: { Likes: { _count: 'desc' } }
    });
    return posts
  }



  async findAllByLikeId(userId: number): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: { Likes: { some: { userId } } },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Likes: { include: { User: { select: { email: true, Profile: true, id: true } } } },
      },
      orderBy: { Likes: { _count: 'desc' } }
    });
    return posts
  }


  async findAllILike(userId: number): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: { Likes: { some: { userId } } },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        Likes: { include: { User: { select: { email: true, Profile: true, id: true } } } },
        Flags: { where: { target: $Enums.FlagTarget.POST, userId } }
      },
      orderBy: { Likes: { _count: 'desc' } }
    });
    return posts
  }


  async update(id: number, data: any): Promise<Post> {
    const { userId, ...post } = data
    return await this.prisma.post.update({
      where: { id },
      data: { ...post, User: { connect: { id: userId } } }
    });
  }

  async remove(id: number): Promise<Post> {
    const element = await this.prisma.post.findUniqueOrThrow({ where: { id } });
    element.image && ImageInterceptor.deleteImage(element.image);
    return await this.prisma.post.delete({ where: { id } });
  }
}
