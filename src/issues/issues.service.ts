import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Issue, Prisma, IssueStep, ServiceStep, GroupUser, $Enums } from '@prisma/client';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { IssueFilter } from './entities/constant';
import { MailerService } from 'src/mailer/mailer.service';
import { ActionType } from 'src/mailer/constant';

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService, private mailer: MailerService) { }

  issueIncludeConfig = {
    User: { select: { email: true, Profile: { include: { Address: true } } } },
    UserModo: { select: { email: true, Profile: { include: { Address: true } } } },
    UserModoResp: { select: { email: true, Profile: { include: { Address: true } } } },
    Service: {
      include: {
        User: { select: { email: true, Profile: { include: { Address: true } } } },
        UserResp: { select: { email: true, Profile: { include: { Address: true } } } },
      }
    }
  }

  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }


  async create(data: CreateIssueDto): Promise<Issue> {
    const { userId, userIdModo, serviceId, userIdModoResp, ...issue } = data;
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      throw new HttpException('Impossible de trouver le service', HttpStatus.NOT_FOUND);
    }
    let createData: Prisma.IssueCreateArgs;
    if (service.userId === userId) {
      createData = {
        data: {
          ...issue,
          User: { connect: { id: userId } },
          Service: { connect: { id: serviceId } },
          UserModo: { connect: { id: userIdModo } }
        }
      };
    } else if (service.userIdResp === userId) {
      createData = {
        data: {
          ...issue,
          User: { connect: { id: userId } },
          Service: { connect: { id: serviceId } },
          UserModoResp: { connect: { id: userIdModoResp } }
        }
      };
    } else {
      throw new HttpException('Vous n\'êtes pas autorisé à créer une demande', 403);
    }
    return await this.prisma.issue.create(createData);
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
        { UserModoResp: { is: { id: userId } } },
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
        OR: [{ UserModo: { is: { id: userId } } }, { UserModoResp: { is: { id: userId } } }]
      },
      include: this.issueIncludeConfig
    })
  }

  async findOneById(id: number, userId: number): Promise<Issue> {
    const issue = await this.prisma.issue.findUniqueOrThrow({
      where: { serviceId: id }, include: this.issueIncludeConfig
    })
    const isAuthorized = [issue.userIdModo, issue.userIdModoResp, issue.Service.userId, issue.Service.userIdResp].includes(userId);
    if (isAuthorized) return issue;
    throw new HttpException('Vous n\'êtes pas autorisé à accéder à cette ressource', 403)
  }

  async updateChoiceModo(id: number, modoId: number, userId: number): Promise<Issue> {
    const issue = await this.prisma.issue.findUniqueOrThrow({ where: { serviceId: id }, include: this.issueIncludeConfig });
    const isAuthorized = [issue.Service.userId, issue.Service.userIdResp].includes(userId);
    if (!isAuthorized) throw new HttpException('Vous n\'êtes pas autorisé à accéder à cette ressource', 403);
    if (issue.status !== IssueStep.STEP_0 && issue.status !== IssueStep.STEP_1) throw new HttpException('Cette demande n\'est plus modifiable', 403);
    const status = issue.status === IssueStep.STEP_0 ? IssueStep.STEP_1 : IssueStep.STEP_2;
    const data = issue.userIdModo === userId ? { userIdModo: modoId, status } : { userIdModoResp: modoId, status };
    return await this.prisma.issue.update({ where: { serviceId: id }, data });
  }

  async updateValidModo(id: number, userId: number): Promise<Issue> {
    const issue = await this.prisma.issue.findUniqueOrThrow({ where: { serviceId: id }, include: this.issueIncludeConfig });
    const isAuthorized = [issue.userIdModo, issue.userIdModoResp].includes(userId);
    if (!isAuthorized) throw new HttpException('Vous n\'êtes pas autorisé à accéder à cette ressource', 403);
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, include: { GroupUser: { where: { groupId: 1 } } } });
    // if (user.GroupUser[0].role !== $Enums.Role.MODO) throw new HttpException('Vous n\'êtes pas autorisé à modérer dans ce groupe', 403);
    if (issue.status !== IssueStep.STEP_1 && issue.status !== IssueStep.STEP_2) throw new HttpException('Cette demande n\'est plus modifiable', 403);
    const mails = [issue.userIdModo === userId ? issue.User.email : issue.Service.UserResp.email];
    const status = issue.status === IssueStep.STEP_1 ? IssueStep.STEP_2 : IssueStep.STEP_3;
    await this.mailer.sendNotificationEmail(mails, 'Validation de votre Modérateur', id, 'conciliation', ActionType.UPDATE, 'le Modérateur que vous avez choisi a validé votre demande');
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
    const issue = await this.prisma.issue.findUniqueOrThrow({ where: { serviceId: id }, include: this.issueIncludeConfig });
    if (userId !== issue.userIdModo && userId !== issue.userIdModoResp) throw new HttpException('Vous n\'êtes pas autorisé à accéder à cette ressource', 403);
    const status = issue.status === IssueStep.STEP_3 ? IssueStep.STEP_4 : IssueStep.STEP_5;
    const servicePoints: number = issue.Service.points;
    const pointsToCred: number = (pourcent * servicePoints) / 200;
    const userToCred = issue.userIdModo === userId ? issue.Service.userId : issue.Service.userIdResp;
    const otherUser = issue.userIdModo === userId ? issue.Service.userIdResp : issue.Service.userId;
    await this.prisma.profile.update({ where: { userId: userToCred }, data: { points: { increment: pointsToCred } } });
    await this.prisma.profile.update({ where: { userId: otherUser }, data: { points: { increment: servicePoints - pointsToCred } } });
    await this.prisma.service.update({ where: { id: issue.serviceId }, data: { points: servicePoints / 2 } });
    if (status === IssueStep.STEP_4) await this.prisma.service.update({ where: { id: issue.serviceId }, data: { status: ServiceStep.STEP_4 } });
    const mails = [issue.userIdModo === userId ? issue.Service.UserResp.email : issue.Service.User.email];
    const title = status === IssueStep.STEP_4 ? 'Votre concialation à ete mise à jour' : 'Votre concialation à ete cloturé';
    const msg = issue.userIdModo === userId ? `Vous avez recu ${pointsToCred} points pour cette concialation` : `Vous avez recu ${servicePoints - pointsToCred} points pour cette concialation`;
    await this.mailer.sendNotificationEmail(mails, title, id, 'conciliation', ActionType.UPDATE, msg)
    return await this.prisma.issue.update({ where: { serviceId: id }, data: { status } });
  }

  async remove(id: number, userId: number): Promise<Issue> {
    const element = await this.prisma.issue.findUniqueOrThrow({ where: { serviceId: id } });
    if (element.userId !== userId) throw new HttpException('Vous n\'êtes pas autorisé à effacer cette ressource', 403)
    element.image && ImageInterceptor.deleteImage(element.image);
    return await this.prisma.issue.delete({ where: { serviceId: id } });
  }
}
