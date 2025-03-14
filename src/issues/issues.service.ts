import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Issue, Prisma, IssueStep, ServiceStep, $Enums } from '@prisma/client';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { IssueFilter } from './entities/constant';
import { NotificationsService } from '../notifications/notifications.service';
import { UserNotifInfo } from 'src/notifications/entities/notification.entity';

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) { }

  private issueIncludeConfig = {
    User: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
    UserModo: { select: { email: true, Profile: { include: { Address: true } } } },
    UserModoOn: { select: { email: true, Profile: { include: { Address: true } } } },
    Service: {
      include: {
        User: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
        UserResp: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
      }
    }
  }

  private userSelectConfig = {
    id: true,
    email: true,
    Profile: { select: { mailSub: true } }
  }

  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }


  async create(data: CreateIssueDto): Promise<Issue> {
    const { userId, userIdModo, serviceId, userIdModoOn, ...issue } = data;
    const service = await this.prisma.service.findUnique({
      where: {
        id: serviceId,
        OR: [{ userId }, { userIdResp: userId }]
      }
    });
    if (!service) {
      throw new HttpException('Impossible de trouver le service', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.issue.create({
      data: {
        ...issue,
        User: { connect: { id: userId } },
        Service: { connect: { id: serviceId } },
        UserModo: { connect: { id: userIdModo } }
      }
    });
  }

  async findAll(userId: number, page: number, filter?: string): Promise<{ issues: Issue[], count: number }> {
    const status = () => {
      switch (true) {
        case (filter === IssueFilter.WAITING):
          return { in: [IssueStep.STEP_0, IssueStep.STEP_1, IssueStep.STEP_2] }
        case (filter === IssueFilter.PENDING):
          return { in: [IssueStep.STEP_3] }
        case (filter === IssueFilter.FINISH):
          return { in: [IssueStep.STEP_4] }
        default:
          return { in: [IssueStep.STEP_0, IssueStep.STEP_1, IssueStep.STEP_2, IssueStep.STEP_3, IssueStep.STEP_4] }
      }
    }
    const where = {
      OR: [
        { UserModo: { is: { id: userId } } },
        { UserModoOn: { is: { id: userId } } },
        { Service: { is: { userId } } },
        { Service: { is: { userIdResp: userId } } },
      ],
      status: status()
    };
    const skip = page ? this.skip(page) : 0;
    const count = await this.prisma.issue.count({ where });
    const take = page ? this.limit : count;
    const issues = await this.prisma.issue.findMany({ take, skip, where, include: this.issueIncludeConfig })
    return { issues, count };
  }

  async findAllByUserId(userId: number): Promise<Issue[]> {
    return await this.prisma.issue.findMany({
      where: {
        OR: [{ Service: { is: { userId } } }, { Service: { is: { userIdResp: userId } } }]
      },
      include: this.issueIncludeConfig
    })
  }


  async findAllByUserModoId(userId: number): Promise<Issue[]> {
    return await this.prisma.issue.findMany({
      where: {
        OR: [{ UserModo: { is: { id: userId } } }, { UserModoOn: { is: { id: userId } } }]
      },
      include: this.issueIncludeConfig
    })
  }

  async findOneById(id: number, userId: number): Promise<Issue> {
    return this.prisma.issue.findUniqueOrThrow({
      where: {
        serviceId: id,
        OR: [{ UserModo: { is: { id: userId } } },
        { UserModoOn: { is: { id: userId } } },
        { Service: { is: { userId } } },
        { Service: { is: { userIdResp: userId } } }]
      }, include: this.issueIncludeConfig
    })
  }

  async updateChoiceModo(id: number, modoId: number, userId: number): Promise<Issue> {
    const issue = await this.prisma.issue.findUniqueOrThrow({
      where: {
        serviceId: id,
        OR: [{ Service: { is: { userId } } }, { Service: { is: { userIdResp: userId } } }],
        AND: [{ status: IssueStep.STEP_0 }, { status: IssueStep.STEP_1 }]
      }, include: this.issueIncludeConfig
    });
    const status = issue.status === IssueStep.STEP_0 ? IssueStep.STEP_1 : IssueStep.STEP_2;
    const data = issue.userIdModo === userId ? { userIdModo: modoId, status } : { userIdModoOn: modoId, status };
    return await this.prisma.issue.update({ where: { serviceId: id }, data });
  }

  async updateValidModo(id: number, userId: number): Promise<Issue> {
    const issue = await this.prisma.issue.findUniqueOrThrow({
      where: {
        serviceId: id,
        OR: [{ UserModo: { is: { id: userId } } }, { UserModoOn: { is: { id: userId } } }],
        AND: [{ status: IssueStep.STEP_1 }, { status: IssueStep.STEP_2 }]
      }, include: this.issueIncludeConfig
    });
    const userInfo = issue.userIdModo === userId ? issue.User : issue.Service.UserResp;
    const status = issue.status === IssueStep.STEP_1 ? IssueStep.STEP_2 : IssueStep.STEP_3;
    const notification = {
      userId: issue.User.id,
      title: 'Validation de votre Modérateur',
      description: `Le Modérateur que vous avez choisi a validé votre demande`,
      type: $Enums.NotificationType.ISSUE,
      level: $Enums.NotificationLevel.SUB_1,
      link: `conciliation/${id}`
    };

    await this.notificationsService.create(new UserNotifInfo(userInfo), notification);


    return await this.prisma.issue.update({ where: { serviceId: id }, data: { status } });
  }

  async update(id: number, data: UpdateIssueDto, userId: number): Promise<Issue> {
    const issue = await this.prisma.issue.findUniqueOrThrow({ where: { serviceId: id }, include: { Service: true } });
    if (issue.userId !== userId) throw new HttpException('Vous n\'êtes pas autorisé à accéder à cette ressource', 403)
    return await this.prisma.issue.update({
      where: { serviceId: id },
      data
    })
  }

  async updateFinish(id: number, userId: number, pourcent: number): Promise<Issue> {
    const issue = await this.prisma.issue.findUniqueOrThrow({
      where: {
        serviceId: id,
        OR: [{ UserModo: { is: { id: userId } } }, { UserModoOn: { is: { id: userId } } }],
      }, include: this.issueIncludeConfig
    })
    const status = issue.status === IssueStep.STEP_3 ? IssueStep.STEP_4 : IssueStep.STEP_5;
    const servicePoints: number = issue.Service.points;
    const pointsToCred: number = (pourcent * servicePoints) / 200;
    const userToCred = issue.userIdModo === userId ? issue.Service.userId : issue.Service.userIdResp;
    const otherUser = issue.userIdModo === userId ? issue.Service.userIdResp : issue.Service.userId;
    await this.prisma.profile.update({ where: { userId: userToCred }, data: { points: { increment: pointsToCred } } });
    await this.prisma.profile.update({ where: { userId: otherUser }, data: { points: { increment: servicePoints - pointsToCred } } });
    await this.prisma.service.update({ where: { id: issue.serviceId }, data: { points: servicePoints / 2 } });
    if (status === IssueStep.STEP_4) await this.prisma.service.update({ where: { id: issue.serviceId }, data: { status: ServiceStep.STEP_4 } });
    const userInfo = issue.userIdModo === userId ? issue.Service.UserResp : issue.Service.User
    const title = status === IssueStep.STEP_4 ? 'Votre concialation à ete mise à jour' : 'Votre conciliation à ete cloturé';
    const description = issue.userIdModo === userId ? `Vous avez recu ${pointsToCred} points pour cette concialation` : `Vous avez recu ${servicePoints - pointsToCred} points pour cette concialation`;
    const notification = {
      title,
      description,
      type: $Enums.NotificationType.ISSUE,
      level: $Enums.NotificationLevel.SUB_1,
      link: `conciliation/${id}`,
      userId: userInfo.id
    }
    await this.notificationsService.create(new UserNotifInfo(userInfo), notification);
    return await this.prisma.issue.update({ where: { serviceId: id }, data: { status } });
  }

  async remove(id: number, userId: number): Promise<Issue> {
    const element = await this.prisma.issue.findUniqueOrThrow({
      where: { serviceId: id },
      include: { Service: { include: { User: { select: this.userSelectConfig }, UserResp: { select: this.userSelectConfig } } } }
    });
    if (element.userId !== userId) throw new HttpException('Vous n\'êtes pas autorisé à effacer cette ressource', 403)
    element.image && ImageInterceptor.deleteImage(element.image);
    const issue = await this.prisma.issue.delete({ where: { serviceId: id } });
    const notification = {
      title: 'Suppression de concilation',
      description: `La conciliation sur ${element.Service.title} a été supprimée`,
      type: $Enums.NotificationType.ISSUE,
      level: $Enums.NotificationLevel.SUB_1,
    }
    await this.notificationsService.createMany([new UserNotifInfo(element.Service.User), new UserNotifInfo(element.Service.UserResp)], notification);
    return issue;
  }
}
