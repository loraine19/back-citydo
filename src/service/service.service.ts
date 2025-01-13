import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Profile, Service } from '@prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { GetPoints } from '../../middleware/GetPoints';
import { ImageInterceptor } from 'middleware/ImageInterceptor';

//// SERVICE MAKE ACTION
@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateServiceDto): Promise<Service> {
    const { userId, userIdResp, ...service } = data
    return await this.prisma.service.create({ data: { ...service, User: { connect: { id: userId } } } })
  }

  async findAll(userId: number): Promise<Service[]> {
    return await this.prisma.service.findMany({
      where: { status: { in: [$Enums.ServiceStep.STEP_0, $Enums.ServiceStep.STEP_1] } },
      include: {
        User: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
        UserResp: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
        Flags: { where: { target: $Enums.FlagTarget.SERVICE, userId } }
      }
    });
  }

  async findAllByUser(userId: number): Promise<Service[]> {
    const services = await this.prisma.service.findMany(
      {
        where: {
          OR: [
            { User: { is: { id: userId } } },
            { UserResp: { is: { id: userId } } }
          ]
        },
        include: {
          User: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          UserResp: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          Flags: { where: { target: $Enums.FlagTarget.SERVICE, userId } }
        }
      }
    )
    return services
  }
  async findAllByUserAndStatus(userId: number, status: $Enums.ServiceStep): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      where: {
        OR: [
          { User: { is: { id: userId } } },
          { UserResp: { is: { id: userId } } }
        ],
        status: status
      },
      include: {
        User: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
        UserResp: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
        Flags: { where: { target: $Enums.FlagTarget.SERVICE, userId } }
      }
    });
    return services;
  }

  async findAllByUserGet(userId: number): Promise<Service[]> {
    const services = await this.prisma.service.findMany(
      {
        where: {
          OR: [
            { User: { is: { id: userId } } },
            { UserResp: { is: { id: userId } } }
          ],
          type: $Enums.ServiceType.GET
        },
        include: {
          User: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          UserResp: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          Flags: { where: { target: $Enums.FlagTarget.SERVICE, userId } }
        }
      }
    )
    return services
  }
  async findAllByUserDo(userId: number): Promise<Service[]> {
    const services = await this.prisma.service.findMany(
      {
        where: {
          OR: [
            { User: { is: { id: userId } } },
            { UserResp: { is: { id: userId } } }
          ],
          type: $Enums.ServiceType.DO
        },
        include: {
          User: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          UserResp: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          Flags: { where: { target: $Enums.FlagTarget.SERVICE, userId } }
        }
      }
    )
    return services
  }

  async findAllByUserId(userId: number): Promise<Service[]> {
    const services = await this.prisma.service.findMany(
      {
        where: { User: { is: { id: userId } } }, include: {
          User: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          UserResp: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          Flags: { where: { target: $Enums.FlagTarget.SERVICE, userId } }
        }
      }
    )
    return services
  }

  async findAllByUserRespId(userId: number): Promise<Service[]> {
    const services = await this.prisma.service.findMany(
      {
        where: { UserResp: { is: { id: userId } } },
        include: {
          User: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          UserResp: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          Flags: { where: { target: $Enums.FlagTarget.SERVICE, userId } }
        }
      }
    )
    return services
  }

  async findAllGet(userId: number): Promise<Service[]> {
    const services = await this.prisma.service.findMany(
      {
        where: { type: $Enums.ServiceType.GET, status: { notIn: [$Enums.ServiceStep.STEP_3, $Enums.ServiceStep.STEP_4] } },
        include: {
          User: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          UserResp: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          Flags: { where: { target: $Enums.FlagTarget.SERVICE, userId } }
        }
      }
    )
    return services
  }


  async findAllDo(userId: number): Promise<Service[]> {
    const services = await this.prisma.service.findMany(
      {
        where: { type: $Enums.ServiceType.DO, status: { notIn: [$Enums.ServiceStep.STEP_3, $Enums.ServiceStep.STEP_4] } },
        include: {
          User: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          UserResp: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
          Flags: { where: { target: $Enums.FlagTarget.SERVICE, userId } }
        }
      }
    )

    return services
  }


  async findOne(id: number, userId: number): Promise<Service> {
    return await this.prisma.service.findUniqueOrThrow({
      where: { id },
      include: {
        User: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
        UserResp: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
        Flags: { where: { target: $Enums.FlagTarget.SERVICE, userId } }
      }
    });
  }



  async update(id: number, data: any): Promise<Service> {
    const { userId, userIdResp, ...service } = data;
    const updateData: any = { ...service };

    if (userId) {
      updateData.User = { connect: { id: userId } };
    }
    if (userIdResp) {
      updateData.UserResp = { connect: { id: userIdResp } };
    }

    return await this.prisma.service.update({
      where: { id },
      data: updateData,
    });
  }
  async updateUserResp(id: number, data: { userIdResp: number }): Promise<Service> {
    const { userIdResp } = data;
    if (userIdResp === 0) {
      return await this.prisma.service.update({
        where: { id },
        data: { UserResp: { disconnect: true }, status: $Enums.ServiceStep.STEP_0 }
      });
    } else {
      return await this.prisma.service.update({
        where: { id },
        data: { UserResp: { connect: { id: userIdResp } }, status: $Enums.ServiceStep.STEP_1 }
      });
    }
  }

  async updateValidUserResp(id: number, data: { userIdResp: number, userId: number }): Promise<Service> {
    const { userIdResp } = data;
    const service = await this.prisma.service.findUnique({ where: { id } });
    console.log((service.userIdResp === userIdResp))
    if (service.userId !== data.userId) {
      throw new HttpException(`You are not allowed to update this service`, HttpStatus.FORBIDDEN)
    }
    if (userIdResp === 0) {
      return await this.prisma.service.update({
        where: { id },
        data: { UserResp: { disconnect: true }, status: $Enums.ServiceStep.STEP_0 }
      });
    } else {
      return await this.prisma.service.update({
        where: { id },
        data: { UserResp: { connect: { id: userIdResp } }, status: $Enums.ServiceStep.STEP_2 }
      });
    }
  }



  async updateFinish(id: number, userId: number): Promise<Service> {
    const service = await this.prisma.service.findUnique({ where: { id } });
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { Profile: { include: { Address: true } } } });
    const userResp = await this.prisma.user.findUnique({ where: { id: service.userIdResp }, include: { Profile: { include: { Address: true } } } });
    const points = GetPoints(service, userResp.Profile);
    if (service.userId !== userId) {
      throw new HttpException(`You are not allowed to update this service`, HttpStatus.FORBIDDEN)
    }
    if (user.Profile.points < points) {
      throw new HttpException(`You don't have enough points`, HttpStatus.FORBIDDEN)
    }
    const updateUserProfile: Profile = await this.prisma.profile.update({ where: { userId: user.id }, data: { points: user.Profile.points - points } });
    let updateUserRespProfile: Profile;
    if (updateUserProfile) {
      updateUserRespProfile = await this.prisma.profile.update({ where: { userId: userResp.id }, data: { points: userResp.Profile.points + points } });
    }
    if (updateUserProfile && updateUserRespProfile) {
      return await this.prisma.service.update({
        where: { id },
        data: { status: $Enums.ServiceStep.STEP_3 }
      });
    }
  }

  async remove(id: number): Promise<Service> {
    const service = await this.prisma.service.findUniqueOrThrow({ where: { id } });
    service.image && ImageInterceptor.deleteImage(service.image)
    return await this.prisma.service.delete({ where: { id } });
  }
}
