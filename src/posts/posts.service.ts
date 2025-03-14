import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { $Enums, Post } from '@prisma/client';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) { }


  private postIncludeConfig(userId?: number) {
    return {
      User: { select: { email: true, Profile: { include: { Address: true } } } },
      Flags: { where: { target: $Enums.FlagTarget.EVENT, userId } },
      Likes: true,
    };
  }

  private userSelectConfig = {
    id: true,
    email: true,
    Profile: { select: { mailSub: true } }
  }

  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }

  async create(data: CreatePostDto): Promise<Post> {
    const { userId, ...post } = data
    const postCreated = await this.prisma.post.create({ data: { ...post, User: { connect: { id: userId } } } })
    const user = await this.prisma.user.findUnique({ where: { id: userId, Profile: { addressShared: true } }, select: { id: true, email: true, Profile: { select: { Address: true } } } });
    const addressId = user ? user.Profile.Address.id : null;
    const users = await this.prisma.user.findMany({ select: this.userSelectConfig });
    const notification = {
      type: $Enums.NotificationType.POST,
      level: $Enums.NotificationLevel.ONLY_APP,
      title: `Nouvelle annonce`,
      description: `${post.title} a été postée`,
      link: `/annonce/${postCreated.id}`,
      addressId
    }
    await this.notificationsService.createMany(users, notification)
    return postCreated;
  }

  async findAll(userId: number, page?: number, category?: string): Promise<{ posts: Post[], count: number }> {
    const skip = page ? this.skip(page) : 0;
    const where = category ? { category: $Enums.PostCategory[category] } : {}
    const count = await this.prisma.post.count({ where });
    const take = page ? this.limit : count;
    console.log(skip, take, where)
    const posts = await this.prisma.post.findMany({
      skip,
      take,
      where,
      include: this.postIncludeConfig(userId),
      orderBy: { Likes: { _count: 'desc' } }
    }) || [];
    return { posts, count };
  }

  async findAllByUserId(userId: number, page?: number, category?: string,): Promise<{ posts: Post[], count: number }> {
    const skip = page ? this.skip(page) : 0;
    const where = category ? { userId, category: $Enums.PostCategory[category] } : { userId }
    const count = await this.prisma.post.count({ where });
    const take = page ? this.limit : count;
    const posts = await this.prisma.post.findMany({
      skip,
      take,
      where,
      include: this.postIncludeConfig(userId),
      orderBy: { Likes: { _count: 'desc' } }
    }) || [];
    return { posts, count };
  }


  async findAllILike(userId: number, page?: number, category?: string,): Promise<{ posts: Post[], count: number }> {
    const skip = page ? this.skip(page) : 0;
    const where = category ? { Likes: { some: { userId } }, category: $Enums.PostCategory[category] } : { Likes: { some: { userId } } }
    const count = await this.prisma.post.count({ where });
    const take = page ? this.limit : count;
    const posts = await this.prisma.post.findMany({
      skip,
      take,
      where,
      include: this.postIncludeConfig(userId),
      orderBy: { Likes: { _count: 'desc' } }
    }) || [];
    return { posts, count };
  }


  async findOne(id: number, userId: number): Promise<Post> {
    return await this.prisma.post.findUniqueOrThrow({
      where: { id },
      include: this.postIncludeConfig(userId)
    });
  }


  async update(id: number, data: any): Promise<Post> {
    const { userId, ...post } = data
    return await this.prisma.post.update({
      include: this.postIncludeConfig(userId),
      where: { id },
      data: { ...post, User: { connect: { id: userId } } }
    });
  }

  async remove(id: number, userId: number): Promise<Post> {
    const element = await this.prisma.post.findUniqueOrThrow({ where: { id } });
    if (element.userId !== userId) throw new HttpException('Vous n\'êtes pas autorisé à supprimer cette annonce', 403)
    element.image && ImageInterceptor.deleteImage(element.image);
    return await this.prisma.post.delete({ where: { id } });
  }
}
