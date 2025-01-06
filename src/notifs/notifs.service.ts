import { Injectable } from '@nestjs/common';
import { CreateNotifDto } from './dto/create-notif.dto';
import { UpdateNotifDto } from './dto/update-notif.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotifsService {
  constructor(private prisma: PrismaService) { }


  async findAllByUserId(id: number): Promise<any[]> {
    const userId = id;
    const events = await this.prisma.event.findMany({
      where: {
        OR: [
          { userId },
          { Participants: { some: { userId } } }
        ],
        AND: [{ updatedAt: { gte: new Date(new Date().setDate(new Date().getDate() - 5)) } }]
      }
    })
    const posts = await this.prisma.post.findMany({
      where: {
        OR: [
          { userId },
          { Likes: { some: { userId } } }],
        AND: [{ updatedAt: { gte: new Date(new Date().setDate(new Date().getDate() - 5)) } }]
      }
    })
    const services = await this.prisma.service.findMany({
      where: {
        OR: [
          { userId },
          { userIdResp: userId }],
        AND: [{ updatedAt: { gte: new Date(new Date().setDate(new Date().getDate() - 5)) } }]
      }
    })
    const issues = await this.prisma.issue.findMany({
      where: {
        OR: [
          { userId },
          { userIdModo: userId },
          { userIdModo2: userId }
        ],
        AND: [{ updatedAt: { gte: new Date(new Date().setDate(new Date().getDate() - 5)) } }]
      }, include: { Service: true }
    })
    const all = []
    const combinedResults = all.concat(
      events.map(event => ({ ...event, element: 'EVENT' })),
      posts.map(post => ({ ...post, element: 'POST' })),
      services.map(service => ({ ...service, element: 'SERVICE' })),
      issues.map(issue => ({ ...issue, title: `${issue.Service.title}`, element: 'ISSUE' }))
    )
    return combinedResults.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
}
