import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Profile, Issue } from '@prisma/client';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { GetPoints } from 'middleware/GetPoints';

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService) { }

  async create(data: any): Promise<Issue> {
    const { userId, userIdModo, serviceId, userIdModo2, ...issue } = data;

    const createdIssue = await this.prisma.issue.create({
      data: {
        ...issue,
        User: { connect: { id: userId } },
        Service: { connect: { id: serviceId } },
        ...(userIdModo2 && { UserModo2: { connect: { id: userIdModo2 } } }),
        ...(userIdModo && { UserModo: { connect: { id: userIdModo } } })
      }
    });
    await this.prisma.service.update({
      where: { id: serviceId },
      data: { status: $Enums.ServiceStep.STEP_4 }
    });
    return createdIssue;
  }

  async findAll(): Promise<Issue[]> {
    return await this.prisma.issue.findMany({
      where: { status: { in: [$Enums.IssueStep.STEP_0, $Enums.IssueStep.STEP_1] } },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        UserModo: { select: { id: true, email: true, Profile: true } },
        UserModo2: { select: { id: true, email: true, Profile: true } },
        Service: {
          include: {
            User: { select: { id: true, email: true, Profile: true } },
            UserResp: { select: { id: true, email: true, Profile: true } }
          }
        }
      }
    });
  }

  async findAllByUser(userId: number): Promise<Issue[]> {
    return await this.prisma.issue.findMany({
      where: {
        OR: [
          { User: { is: { id: userId } } },
          { UserModo: { is: { id: userId } } }
        ]
      },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        UserModo: { select: { id: true, email: true, Profile: true } },
        UserModo2: { select: { id: true, email: true, Profile: true } },
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
        UserModo2: { select: { id: true, email: true, Profile: true } },
        Service: {
          include: {
            User: { select: { id: true, email: true, Profile: true } },
            UserResp: { select: { id: true, email: true, Profile: true } }
          }
        }
      }
    });
  }



  async findAllByUserId(userId: number): Promise<Issue[]> {
    return await this.prisma.issue.findMany({
      where: { User: { is: { id: userId } } },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        UserModo: { select: { id: true, email: true, Profile: true } },
        UserModo2: { select: { id: true, email: true, Profile: true } },
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
          { UserModo2: { is: { id: userId } } }
        ]
      },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        UserModo: { select: { id: true, email: true, Profile: true } },
        UserModo2: { select: { id: true, email: true, Profile: true } },
        Service: {
          include: {
            User: { select: { id: true, email: true, Profile: true } },
            UserResp: { select: { id: true, email: true, Profile: true } }
          }
        }
      }
    });
  }



  async findOne(id: number): Promise<Issue> {
    return await this.prisma.issue.findUniqueOrThrow({
      where: { serviceId: id },
      include: {
        User: { select: { id: true, email: true, Profile: true } },
        UserModo: { select: { id: true, email: true, Profile: true } },
        UserModo2: { select: { id: true, email: true, Profile: true } },
        Service: {
          include: {
            User: { select: { id: true, email: true, Profile: true } },
            UserResp: { select: { id: true, email: true, Profile: true } }
          }
        }
      }
    })
  }

  async update(id: number, data: UpdateIssueDto): Promise<Issue> {
    const { ...issue } = data;
    return await this.prisma.issue.update({
      where: { serviceId: id },
      data: { ...issue }
    })
  }



  async remove(id: number): Promise<Issue> {
    return await this.prisma.issue.delete({ where: { serviceId: id } });
  }
}
