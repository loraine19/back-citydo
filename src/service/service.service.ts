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


  private serviceIncludeConfig(userId?: number) {
    return {
      User: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
      UserResp: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
      Flags: { where: { target: $Enums.FlagTarget.SERVICE, userId } }
    }
  }
  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }




  async findAll(userId: number, page?: number, type?: $Enums.ServiceType, step?: $Enums.ServiceStep, category?: $Enums.ServiceCategory,): Promise<Service[]> {
    const skip = page ? this.skip(page) : 0;
    const take = page ? this.limit : await this.prisma.event.count();
    const status = step ? $Enums.ServiceStep[step] : { in: [$Enums.ServiceStep.STEP_0, $Enums.ServiceStep.STEP_1] }
    const where = { type, status, category }
    console.log(where, $Enums.ServiceStep[step])
    const all = await this.prisma.service.findMany({
      skip,
      take,
      where,
      include: this.serviceIncludeConfig(userId),
    });
    return all
  }


  async findAllByUser(userId: number, page?: number, type?: $Enums.ServiceType, step?: $Enums.ServiceStep, category?: $Enums.ServiceCategory,): Promise<Service[]> {
    const skip = page ? this.skip(page) : 0;
    const take = page ? this.limit : await this.prisma.event.count();
    const where = { OR: [{ User: { is: { id: userId } } }, { UserResp: { is: { id: userId } } }], type, status: $Enums.ServiceStep[step], category }
    console.log(where)
    if (step || category || type) {
      const all = await this.prisma.service.findMany({
        skip,
        take,
        where,
        include: this.serviceIncludeConfig(userId),
      });
      return all

    }
    return []
  }


  async findOne(id: number, userId: number): Promise<Service> {
    return await this.prisma.service.findUniqueOrThrow({
      where: { id },
      include: this.serviceIncludeConfig(userId),
    });
  }


  async create(data: CreateServiceDto): Promise<Service> {
    const { userId, userIdResp, ...service } = data
    return await this.prisma.service.create({ data: { ...service, User: { connect: { id: userId } } } })
  }

  async update(id: number, data: any,): Promise<Service> {
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

  //// POST_RESP
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

  //// VALID_RESP
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


  //// FINISH
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
