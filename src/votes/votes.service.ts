import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Vote } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserNotifInfo } from 'src/notifications/entities/notification.entity';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) { }

  private userSelectConfig = { id: true, email: true, Profile: { select: { mailSub: true, firstName: true } } }

  async create(data: CreateVoteDto): Promise<Vote> {
    const { targetId, target, userId, opinion } = data
    const find = target === $Enums.VoteTarget.POOL ?
      await this.prisma.pool.findUnique({ where: { id: targetId }, select: { User: { select: this.userSelectConfig } } }) : await this.prisma.survey.findUnique({ where: { id: targetId }, select: { User: { select: this.userSelectConfig } } });
    if (!find) throw new HttpException(`${target} n'existe pas`, HttpStatus.NOT_FOUND);
    const vote = await this.prisma.vote.findUnique({ where: { userId_target_targetId: { userId, targetId, target } } });
    if (vote) throw new HttpException('Vous avez déjà voté', 403)
    const opinionS = opinion === $Enums.VoteOpinion.OK && 'pour ' || opinion === $Enums.VoteOpinion.NO && 'contre ' || 'neutre'
    if (target === $Enums.VoteTarget.POOL) {
      const vote = await this.prisma.vote.create({
        data: {
          opinion, target, Pool: { connect: { id: targetId } },
          User: { connect: { id: userId } },
        }
      })
      const notification = {
        type: $Enums.NotificationType.VOTE,
        level: $Enums.NotificationLevel.SUB_3,
        title: 'Nouveau vote',
        description: `Un utilisateur a voté : ${opinionS} ,  votre cagnotte`,
        link: `/cagnotte/${targetId}`
      }
      await this.notificationsService.create(new UserNotifInfo(find.User), notification)
      return vote
    }
    else if (target === $Enums.VoteTarget.SURVEY) {
      const vote = await this.prisma.vote.create({
        data: { opinion, target, Survey: { connect: { id: targetId } }, User: { connect: { id: userId } } }
      })
      const notification = {
        type: $Enums.NotificationType.VOTE,
        level: $Enums.NotificationLevel.SUB_3,
        title: 'Nouveau vote',
        description: `Un utilisateur a voté : ${opinionS} ,  votre sondage`,
        link: `/sondage/${targetId}`
      }
      await this.notificationsService.create(new UserNotifInfo(find.User), notification)
      return vote
    }
  }


  async update(userId: number, data: UpdateVoteDto): Promise<Vote> {
    const { targetId, target } = data
    const vote = await this.prisma.vote.findUnique({ where: { userId_target_targetId: { userId, targetId: data.targetId, target: data.target } } });
    if (!vote) throw new HttpException('Votre vote n\'existe pas', 404)
    if (vote.createdAt.getTime() + 24 * 60 * 60 * 1000 < new Date().getTime()) throw new HttpException('Vous ne pouvez pas modifier ce vote, il est trop vieux', 403)
    return await this.prisma.vote.update({
      where: { userId_target_targetId: { userId, targetId, target } },
      data: { ...data },
    });
  }

  async remove(userId: number, targetId: number, target: $Enums.VoteTarget,): Promise<Vote> {
    return await this.prisma.vote.delete({ where: { userId_target_targetId: { userId, targetId, target } }, });
  }
}