import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Profile, Issue, Service, Prisma } from '@prisma/client';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { GetPoints } from 'middleware/GetPoints';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService) { }
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

  async findAll(userId: number): Promise<Issue[]> {
    const issues = await this.prisma.issue.findMany({
      where: {
        OR: [
          { UserModo: { is: { id: userId } } },
          { UserModoResp: { is: { id: userId } } },
          { Service: { is: { userId } } },
          { Service: { is: { userIdResp: userId } } },
        ],
        //  status: { in: [$Enums.IssueStep.STEP_0, $Enums.IssueStep.STEP_1] }
      },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        UserModo: { select: { id: true, email: true, Profile: true } },
        UserModoResp: { select: { id: true, email: true, Profile: true } },
        Service: {
          include: {
            User: { select: { id: true, email: true, Profile: true } },
            UserResp: { select: { id: true, email: true, Profile: true } }
          }
        }
      }
    })
    return issues;
  }

  async findAllByUserId(userId: number): Promise<Issue[]> {
    return await this.prisma.issue.findMany({
      where: {
        OR: [
          { Service: { is: { userId } } },
          { Service: { is: { userIdResp: userId } } },
        ]
      },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        UserModo: { select: { id: true, email: true, Profile: true } },
        UserModoResp: { select: { id: true, email: true, Profile: true } },
        Service: {
          include: {
            User: { select: { id: true, email: true, Profile: true } },
            UserResp: { select: { id: true, email: true, Profile: true } }
          }
        }
      }
    });
  }


  async findAllByUserModoId(userId: number): Promise<Issue[]> {
    return await this.prisma.issue.findMany({
      where: {
        OR: [
          { UserModo: { is: { id: userId } } },
          { UserModoResp: { is: { id: userId } } }
        ]
      },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        UserModo: { select: { id: true, email: true, Profile: true } },
        UserModoResp: { select: { id: true, email: true, Profile: true } },
        Service: {
          include: {
            User: { select: { id: true, email: true, Profile: true } },
            UserResp: { select: { id: true, email: true, Profile: true } }
          }
        }
      }
    });
  }


  async findAllByUserAndStatus(userId: number, status: $Enums.IssueStep): Promise<Issue[]> {
    return await this.prisma.issue.findMany({
      where: {
        OR: [
          { User: { is: { id: userId } } },
          { UserModo: { is: { id: userId } } }
        ],
        status: status
      },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        UserModo: { select: { id: true, email: true, Profile: true } },
        UserModoResp: { select: { id: true, email: true, Profile: true } },
        Service: {
          include: {
            User: { select: { id: true, email: true, Profile: true } },
            UserResp: { select: { id: true, email: true, Profile: true } }
          }
        }
      }
    });
  }


  async findOneById(id: number, userId: number): Promise<Issue> {
    const issue = await this.prisma.issue.findUniqueOrThrow({
      where: { serviceId: id },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        UserModo: { select: { id: true, email: true, Profile: true } },
        UserModoResp: { select: { id: true, email: true, Profile: true } },
        Service: {
          include: {
            User: { select: { id: true, email: true, Profile: true } },
            UserResp: { select: { id: true, email: true, Profile: true } }
          }
        }
      }
    })
    if (issue.UserModo.id === userId || issue.UserModoResp.id === userId || issue.Service.User.id === userId || issue.Service.UserResp.id === userId) {
      return issue
    }
    throw new HttpException('Vous n\'êtes pas autorisé à accéder à cette ressource', 403)
  }

  async update(id: number, data: UpdateIssueDto, userId: number): Promise<Issue> {
    const issue = await this.prisma.issue.findUniqueOrThrow({ where: { serviceId: id }, include: { Service: true } });
    if (issue.userIdModo !== userId && issue.userIdModoResp !== userId && issue.Service.userId !== userId && issue.Service.userIdResp !== userId) {
      throw new HttpException('Vous n\'êtes pas autorisé à accéder à cette ressource', 403)
    }
    const { ...updaptedIssue } = data;
    return await this.prisma.issue.update({
      where: { serviceId: id },
      data: { ...updaptedIssue }
    })
  }



  async remove(id: number): Promise<Issue> {
    const element = await this.prisma.issue.findUniqueOrThrow({ where: { serviceId: id } });
    element.image && ImageInterceptor.deleteImage(element.image);
    return await this.prisma.issue.delete({ where: { serviceId: id } });
  }
}
