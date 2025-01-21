import { Injectable } from '@nestjs/common';
import { CreateNotifDto } from './dto/create-notif.dto';
import { UpdateNotifDto } from './dto/update-notif.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getDate } from 'middleware/BodyParser';

@Injectable()
export class NotifsService {
  constructor(private prisma: PrismaService) { }

  before: number = 15

  async findAllByUserId(id: number): Promise<any[]> {
    console.log('before', getDate(this.before))
    const userId = id;
    const events = await this.prisma.event.findMany({
      where: {
        OR: [
          { userId },
          { Participants: { some: { userId } } }
        ],
        AND: [{ updatedAt: { gte: getDate(this.before) } }]
      }
    })
    const posts = await this.prisma.post.findMany({
      where: {
        OR: [
          { userId },
          { Likes: { some: { userId } } }],
        AND: [{ updatedAt: { gte: getDate(this.before) } }]
      }
    })
    const services = await this.prisma.service.findMany({
      where: {
        OR: [
          { userId },
          { userIdResp: userId }],
        AND: [{ updatedAt: { gte: getDate(this.before) } }]
      }
    })
    const issues = await this.prisma.issue.findMany({
      where: {
        OR: [
          { userId },
          { userIdModo: userId },
          { userIdModoResp: userId }
        ],
        AND: [{ updatedAt: { gte: getDate(this.before) } }]
      }, include: { Service: true }
    })
    const pools = await this.prisma.pool.findMany({
      where: {
        OR: [
          { userId },
          { userIdBenef: userId },
          { Votes: { some: { userId } } }
        ],
        AND: [{ updatedAt: { gte: getDate(this.before) } }]
      }
    })
    const surveys = await this.prisma.survey.findMany({
      where: {
        OR: [
          { userId },
          { Votes: { some: { userId } } }
        ],
        AND: [{ updatedAt: { gte: getDate(this.before) } }]
      }
    })
    const all = []
    const combinedResults = all.concat(
      events.map(event => ({ ...event, element: 'EVENT', read: false })),
      posts.map(post => ({ ...post, element: 'POST', read: false })),
      services.map(service => ({ ...service, element: 'SERVICE', read: false })),
      issues.map(issue => ({ ...issue, title: `${issue.Service.title}`, element: 'ISSUE', read: false })),
      pools.map(pool => ({ ...pool, element: 'POOL', read: false })),
      surveys.map(survey => ({ ...survey, element: 'SURVEY', read: false }))
    )
    const result = combinedResults.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    return result
  }
}
