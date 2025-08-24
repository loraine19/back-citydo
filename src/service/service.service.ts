import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Prisma, Profile, Service } from '@prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';
import { GetPoints } from '../../middleware/GetPoints';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { NotificationsService } from '../notifications/notifications.service';
import { UserNotifInfo } from 'src/notifications/entities/notification.entity';
import { ServiceFindParams, ServiceSort } from './entities/service.entity';

//// SERVICE MAKE ACTION
@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) { }

  limit = parseInt(process.env.LIMIT)
  skip(page: number) { return (page - 1) * this.limit }


  private serviceIncludeConfig(userId?: number) {
    return {
      User: { select: { id: true, email: true, GroupUser: { include: { Group: true } }, Profile: { include: { Address: true } } } },
      UserResp: { select: { id: true, email: true, Profile: { include: { Address: true } } } },
      Flags: { where: { target: $Enums.FlagTarget.SERVICE, userId } },
      Group: { include: { GroupUser: true, Address: true, } }
    }
  }

  private userSelectConfig = {
    id: true,
    email: true,
    Profile: { select: { mailSub: true } }
  }

  private groupSelectConfig = (userId: number) => ({ GroupUser: { some: { userId } } })

  private sortBy = (sort: ServiceSort, reverse?: boolean): Prisma.ServiceOrderByWithRelationInput => {
    switch (sort) {
      case ServiceSort.TITLE:
        return reverse ? { title: 'desc' } : { title: 'asc' };
      case ServiceSort.CREATED_AT:
        return reverse ? { createdAt: 'desc' } : { createdAt: 'asc' };
      case ServiceSort.USER:
        return reverse ? { User: { Profile: { firstName: 'desc' } } } :
          { User: { Profile: { firstName: 'asc' } } };
      case ServiceSort.SKILL:
        return reverse ? { skill: 'desc', } : { skill: 'asc', };
      case ServiceSort.HARD:
        return reverse ? { hard: 'desc', } : { hard: 'asc', };
      default:
        return reverse ? { createdAt: 'desc' } : { createdAt: 'asc' }
    }
  }

  async findAll(userId: number, page?: number, params?: ServiceFindParams): Promise<{ services: Service[], count: number }> {
    const { mine, type, step, category, sort, reverse, search } = params;
    const skip = page ? this.skip(page) : 0;
    const types = type ? type.includes(',') ? { in: type.split(',').map(t => $Enums.ServiceType[t]) } :
      $Enums.ServiceType[type] : {};
    const status = step ? step.includes(',') ? { in: step.split(',').map(s => $Enums.ServiceStep[s]) }
      : $Enums.ServiceStep[step] : {};
    const Group = this.groupSelectConfig(userId);
    let where: Prisma.ServiceWhereInput = { type: types, status, category, Group }
    let whereSearch: Prisma.ServiceWhereInput = {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
        { User: { Profile: { firstName: { contains: search } } } },
        { UserResp: { Profile: { firstName: { contains: search } } } }
      ]
    }

    if (mine) where = {
      ...where, OR: [
        { User: { is: { id: userId } } },
        { UserResp: { is: { id: userId } } }
      ],
    }

    if (search) {
      where = { ...where, ...whereSearch }
    }

    const orderBy: Prisma.ServiceOrderByWithRelationInput = sort ? this.sortBy(sort, reverse) : { createdAt: 'desc' };
    const count = await this.prisma.service.count({ where });
    const take = page ? this.limit : count
    const services = await this.prisma.service.findMany({
      skip,
      take,
      where,
      orderBy,
      include: this.serviceIncludeConfig(userId),
    });
    if (mine && !type && !step) return { services: [], count: 0 }
    return { services, count }
  }





  async findOne(id: number, userId: number): Promise<Service> {
    return await this.prisma.service.findUniqueOrThrow({
      where: { id, Group: this.groupSelectConfig(userId) },
      include: this.serviceIncludeConfig(userId),
    });
  }


  async create(data: CreateServiceDto): Promise<Service> {
    const { userId, groupId, ...service } = data;
    const users = await this.prisma.user.findMany({ select: this.userSelectConfig });
    const createdService = await this.prisma.service.create({
      data: {
        ...service,
        User: { connect: { id: userId } },
        Group: { connect: { id: groupId } },
      }, include: this.serviceIncludeConfig(userId)
    });
    const addressId = createdService.User.Profile.addressShared ? createdService.User.Profile.addressId : null;
    const notification = {
      title: 'Nouveau service',
      description: `${service.title} a été créé par ${createdService.User.Profile.firstName}`,
      type: $Enums.NotificationType.SERVICE,
      level: $Enums.NotificationLevel.SUB_1,
      link: `/service/${createdService.id}`,
      addressId
    }
    await this.notificationsService.createMany(users, notification)
    return createdService
  }

  async update(id: number, data: any,): Promise<Service> {
    const { userId, userIdResp, groupId, ...service } = data;
    const updateData: any = { ...service, Group: { connect: { id: groupId } } };
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
  async updatePostResp(id: number, userId: number): Promise<Service> {
    const update = await this.prisma.service.update({
      where: { id },
      include: this.serviceIncludeConfig(userId),
      data: { UserResp: { connect: { id: userId } }, status: $Enums.ServiceStep.STEP_1 }
    });
    if (update) {
      const notification = {
        title: 'Prise en charge de service',
        description: `le service ${update.title} a été pris en charge par ${update.UserResp.Profile.firstName}`,
        type: $Enums.NotificationType.SERVICE,
        level: $Enums.NotificationLevel.SUB_1,
        link: `/service/${id}`,
        addressId: update.UserResp.Profile.addressShared ? update.UserResp.Profile.addressId : null
      }
      await this.notificationsService.createMany([new UserNotifInfo(update.User), new UserNotifInfo(update.UserResp)], notification)
      return update;
    }
  }

  //// CANCEL_RESP
  async updateCancelResp(id: number, userId: number): Promise<Service> {
    const origin = await this.prisma.service.findUnique({ where: { id }, include: { UserResp: { include: { Profile: true } } } });
    const update = await this.prisma.service.update({
      where: { id },
      include: this.serviceIncludeConfig(userId),
      data: { UserResp: { disconnect: true }, status: $Enums.ServiceStep.STEP_0 }
    })
    console.log(update)
    if (update) {
      const notification = {
        title: 'annulation de prise en charge de service',
        description: `la prise en charge du service ${update.title} a été annuler par${origin.UserResp.Profile.firstName}`,
        type: $Enums.NotificationType.SERVICE,
        level: $Enums.NotificationLevel.SUB_1,
        link: `/service/${id}`
      }
      await this.notificationsService.createMany([new UserNotifInfo(update.User), new UserNotifInfo(origin.UserResp)], notification)
      return update;
    }
  }


  //// VALID_RESP
  async updateValidResp(id: number, userId: number): Promise<Service> {
    const service = await this.prisma.service.findUnique({ where: { id }, include: this.serviceIncludeConfig(userId) });
    const UserDo = service.type === $Enums.ServiceType.DO ? service.UserResp : service.User;
    const UserGet = service.type === $Enums.ServiceType.GET ? service.UserResp : service.User;
    const points = GetPoints(service, UserDo.Profile);
    if (UserGet.id !== userId) throw new HttpException(`msg: Vous n'avez pas le droit de valider ce service`, HttpStatus.FORBIDDEN)
    if (UserGet.Profile.points < points) throw new HttpException(`msg: Vous n'avez pas assez de points`, HttpStatus.FORBIDDEN)
    const updateUserProfile: Profile = await this.prisma.profile.update({ where: { userId: UserGet.id }, data: { points: UserGet.Profile.points - points } });
    const update = await this.prisma.service.update({
      where: { id },
      include: this.serviceIncludeConfig(userId),
      data: { UserResp: { connect: { id: service.userIdResp } }, status: $Enums.ServiceStep.STEP_2, points }
    });
    if (update) {
      const notification = {
        title: 'Validation de service',
        description: `le service ${update.title} a ete validé par${update.User.Profile.firstName}`,
        type: $Enums.NotificationType.SERVICE,
        level: $Enums.NotificationLevel.SUB_2,
        link: `/service/${id}`
      }
      await this.notificationsService.createMany([new UserNotifInfo(update.User), new UserNotifInfo(update.UserResp)], notification)
      return update;
    }
  }


  //// FINISH
  async updateFinish(id: number, userId: number): Promise<Service> {
    const service = await this.prisma.service.findUnique({ where: { id }, include: this.serviceIncludeConfig(userId) });
    const UserDo = service.type === $Enums.ServiceType.DO ? service.UserResp : service.User;
    const UserGet = service.type === $Enums.ServiceType.GET ? service.UserResp : service.User;
    const points = GetPoints(service, UserDo.Profile)
    if (UserGet.id !== userId) throw new HttpException(`msg: Vous n'avez pas le droit de cloturerce service`, HttpStatus.FORBIDDEN)
    await this.prisma.profile.update({ where: { userId: UserDo.id }, data: { points: UserDo.Profile.points + points } });
    const update = await this.prisma.service.update({
      where: { id },
      include: this.serviceIncludeConfig(userId),
      data: { status: $Enums.ServiceStep.STEP_3 }
    });
    if (update) {
      const notification = {
        title: 'Cloture de service',
        description: `le service ${update.title} a été cloturé par ${UserGet.Profile.firstName},  ${points} points ont été transférés à ${UserDo.Profile.firstName}`,
        type: $Enums.NotificationType.SERVICE,
        level: $Enums.NotificationLevel.SUB_2,
        link: `/service/${id}`
      }
      await this.notificationsService.createMany([new UserNotifInfo(update.User), new UserNotifInfo(update.UserResp)], notification)
      return update;
    }
  }

  async remove(id: number): Promise<Service> {
    const service = await this.prisma.service.findUniqueOrThrow({ where: { id } });
    service.image && ImageInterceptor.deleteImage(service.image)
    return await this.prisma.service.delete({ where: { id } });
  }
}
